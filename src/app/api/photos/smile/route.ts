import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { applyEmotionEdit, isAILabConfigured } from "@/lib/ailab";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import {
  downloadFromStorage,
  getStorageKeyFromPublicUrl,
  uploadProcessedImage,
} from "@/lib/storage";
import { removeWatermark } from "@/lib/watermark";
import { getOrCreateUser, canUserEdit, incrementEditsUsed } from "@/lib/services/users";
import type { EditJob, GenerationJob } from "@/lib/firebase/types";
import { createEditedGeneration } from "@/lib/create-edited-generation";
import { sanitizeGeneration } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";
import { MAX_EDITS_PER_USER, TESTING_BYPASS_PAYMENT, SMILE_OPTIONS } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { v4 as uuidv4 } from "uuid";

const VALID_CHOICES = new Set(SMILE_OPTIONS.map((o) => o.serviceChoice));

function stripUrlCacheBuster(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("t");
    return parsed.toString();
  } catch {
    return url.split("?")[0] || url;
  }
}

async function tryDownloadStorageKey(storageKey: string): Promise<Buffer | null> {
  try {
    const buffer = await downloadFromStorage(storageKey);
    if (!buffer.length) {
      console.log("[ailab/smile] storage download empty", storageKey);
      return null;
    }
    return buffer;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[ailab/smile] storage download failed", storageKey, message);
    return null;
  }
}

async function resolveSmileImageBuffer(
  generation: GenerationJob | null,
  storageKey: string | undefined,
  sourceImageUrl: string | undefined,
  baseUrl: string
): Promise<Buffer> {
  const storageKeys = new Set<string>();

  if (storageKey) storageKeys.add(storageKey);
  if (generation?.storageKey) storageKeys.add(generation.storageKey);

  for (const url of [sourceImageUrl, generation?.finalImageUrl]) {
    if (!url) continue;
    const parsedKey = getStorageKeyFromPublicUrl(stripUrlCacheBuster(url), baseUrl);
    if (parsedKey) storageKeys.add(parsedKey);
  }

  for (const key of storageKeys) {
    const stored = await tryDownloadStorageKey(key);
    if (stored) {
      console.log("[ailab/smile] loaded from storage", key);
      return stored;
    }
  }

  throw new Error(
    "Could not load the photo for smile edit. Refresh the page and try again."
  );
}

function decodeBase64Image(value: string): Buffer {
  const trimmed = value.trim();
  const payload = trimmed.includes(",") ? trimmed.split(",").pop() || "" : trimmed;
  const buffer = Buffer.from(payload, "base64");
  if (!buffer.length) {
    throw new Error("Invalid image data for smile edit");
  }
  return buffer;
}

function humanizeSmileError(message: string): string {
  if (/key not found/i.test(message)) {
    return "The photo file could not be loaded from storage. Refresh the page and try smile again.";
  }
  if (/failed to fetch image:\s*403/i.test(message)) {
    return "The photo file could not be loaded (access denied). Refresh the page and try smile again.";
  }
  return message;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAILabConfigured()) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    if (!canUserEdit(user)) {
      return NextResponse.json(
        {
          error:
            !TESTING_BYPASS_PAYMENT && user.plan !== "paid"
              ? "Purchase a plan to use AI edits"
              : `Edit limit reached (${MAX_EDITS_PER_USER} max)`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      imageBase64,
      image_base64,
      serviceChoice,
      service_choice,
      generationId,
      storageKey,
      sourceImageUrl,
    } = body as {
      imageBase64?: string;
      image_base64?: string;
      serviceChoice?: number;
      service_choice?: number;
      generationId?: string;
      storageKey?: string;
      sourceImageUrl?: string;
    };

    const resolvedChoice = serviceChoice || service_choice;
    const resolvedBase64 = imageBase64 || image_base64;

    if (!resolvedChoice || !VALID_CHOICES.has(resolvedChoice as 11 | 12 | 13)) {
      return NextResponse.json({ error: "Invalid smile option" }, { status: 400 });
    }

    const baseUrl = getAppBaseUrl(request);
    let resolvedGeneration: GenerationJob | null = null;

    if (generationId && isAdminConfigured()) {
      const genSnap = await getAdminDb().collection(COLLECTIONS.generations).doc(generationId).get();
      if (genSnap.exists) {
        const generation = genSnap.data() as GenerationJob;
        if (generation.userId === auth.uid) {
          resolvedGeneration = generation;
        }
      }
    }

    let imageBuffer: Buffer;
    if (resolvedBase64) {
      imageBuffer = decodeBase64Image(resolvedBase64);
      console.log("[ailab/smile] using client base64 payload", imageBuffer.length);
    } else {
      if (!resolvedGeneration && !storageKey && !sourceImageUrl) {
        return NextResponse.json(
          { error: "imageBase64 or generationId required" },
          { status: 400 }
        );
      }
      imageBuffer = await resolveSmileImageBuffer(
        resolvedGeneration,
        storageKey,
        sourceImageUrl,
        baseUrl
      );
    }

    const { imageBuffer: editedBuffer, requestId } = await applyEmotionEdit(
      imageBuffer,
      resolvedChoice as 11 | 12 | 13
    );
    const cleanedBuffer = await removeWatermark(editedBuffer);
    const stored = await uploadProcessedImage(
      auth.uid,
      cleanedBuffer,
      `smile-${resolvedChoice}-${uuidv4().slice(0, 8)}`
    );

    const smileLabel =
      SMILE_OPTIONS.find((option) => option.serviceChoice === resolvedChoice)?.label || "Smile edit";

    const newGeneration = await createEditedGeneration(resolvedGeneration, auth.uid, {
      sourceGenerationId: generationId || resolvedGeneration?.id || "",
      prompt: `smile:${resolvedChoice}`,
      finalImageUrl: stored.publicUrl,
      storageKey: stored.storageKey,
      referenceName: resolvedGeneration
        ? `${resolvedGeneration.referenceName} · ${smileLabel}`
        : smileLabel,
    });

    const editId = uuidv4();
    const editJob: EditJob = {
      id: editId,
      userId: auth.uid,
      sourceGenerationId: generationId || "",
      prompt: `smile:${resolvedChoice}`,
      status: "completed",
      provider: "ailab",
      resultImageUrl: stored.publicUrl,
      storageKey: stored.storageKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.edits).doc(editId).set(editJob);
    }

    await incrementEditsUsed(auth.uid);

    await logActivity(
      auth.uid,
      "photo_smile_applied",
      { editId, serviceChoice: resolvedChoice, generationId, ailabRequestId: requestId },
      {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    return NextResponse.json({
      imageUrl: stored.publicUrl,
      generation: sanitizeGeneration(newGeneration),
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Smile edit failed";
    const message = humanizeSmileError(toPublicErrorMessage(raw, "Smile edit failed"));
    console.log("[photos/smile] error", raw);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
