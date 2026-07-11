import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { editImageWithNanoBanana2, isFalConfigured } from "@/lib/fal";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import {
  uploadProcessedImage,
  bufferToDataUri,
} from "@/lib/storage";
import { removeWatermark, fetchImageBuffer } from "@/lib/watermark";
import {
  getOrCreateUser,
  canUserEdit,
  incrementEditsUsed,
} from "@/lib/services/users";
import type { EditJob, GenerationJob } from "@/lib/firebase/types";
import { createEditedGeneration } from "@/lib/create-edited-generation";
import { sanitizeGeneration } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";
import { MAX_EDITS_PER_USER, TESTING_BYPASS_PAYMENT, SKIN_RETEXTURE_EDIT_PROMPT } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { v4 as uuidv4 } from "uuid";

function decodeBase64Image(value: string): Buffer {
  const trimmed = value.trim();
  const payload = trimmed.includes(",") ? trimmed.split(",").pop() || "" : trimmed;
  const buffer = Buffer.from(payload, "base64");
  if (!buffer.length) {
    throw new Error("Invalid image data for edit");
  }
  return buffer;
}

function humanizeEditError(message: string): string {
  if (/key not found/i.test(message)) {
    return "Could not load the photo file from storage. Refresh the page and try the edit again.";
  }
  if (/unprocessable entity/i.test(message)) {
    return "The edit service could not process this image. Try a different prompt or reference photo.";
  }
  return message;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFalConfigured()) {
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
    const userPrompt = ((body.prompt as string) || "").trim();
    const retextureSkin = Boolean(body.retextureSkin);
    const sourceImageBase64 = (body.sourceImageBase64 as string) || "";
    const attachmentBase64 = (body.attachmentBase64 as string) || "";
    const generationId = (body.generationId as string) || "";

    if (!sourceImageBase64) {
      return NextResponse.json({ error: "source image required" }, { status: 400 });
    }

    const prompt = retextureSkin
      ? userPrompt
        ? `${userPrompt}, ${SKIN_RETEXTURE_EDIT_PROMPT}`
        : SKIN_RETEXTURE_EDIT_PROMPT
      : userPrompt;
    const storedPrompt = userPrompt || (retextureSkin ? "Re-texture skin" : "");

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    let sourceGeneration: GenerationJob | null = null;
    if (generationId && isAdminConfigured()) {
      const genSnap = await getAdminDb().collection(COLLECTIONS.generations).doc(generationId).get();
      if (genSnap.exists) {
        const generation = genSnap.data() as GenerationJob;
        if (generation.userId === auth.uid) {
          sourceGeneration = generation;
        }
      }
    }

    const sourceBuffer = decodeBase64Image(sourceImageBase64);
    const falSourceUrl = bufferToDataUri(sourceBuffer, "image/jpeg");
    console.log("[edit] using client base64 source", sourceBuffer.length);

    let attachmentFalUrl: string | undefined;
    if (attachmentBase64) {
      const attachmentBuffer = decodeBase64Image(attachmentBase64);
      attachmentFalUrl = bufferToDataUri(attachmentBuffer, "image/jpeg");
      console.log("[edit] using client base64 attachment", attachmentBuffer.length);
    }

    const imageUrls = attachmentFalUrl ? [falSourceUrl, attachmentFalUrl] : [falSourceUrl];
    console.log("[edit] sending to fal", {
      retextureSkin,
      userPrompt,
      falPrompt: prompt,
      promptLength: prompt.length,
      imageCount: imageUrls.length,
      resolution: "2K",
    });

    const editId = uuidv4();
    const editJob: EditJob = {
      id: editId,
      userId: auth.uid,
      sourceGenerationId: generationId || "",
      prompt: storedPrompt,
      status: "processing",
      provider: "fal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.edits).doc(editId).set(editJob);
    }

    const result = await editImageWithNanoBanana2({
      prompt,
      imageUrls,
      aspectRatio: "3:4",
      resolution: "2K",
    });
    const rawBuffer = await fetchImageBuffer(result.imageUrl);
    const cleanedBuffer = await removeWatermark(rawBuffer);
    const stored = await uploadProcessedImage(
      auth.uid,
      cleanedBuffer,
      `edit-${editId.slice(0, 8)}`
    );

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.edits).doc(editId).update({
        status: "completed",
        resultImageUrl: stored.publicUrl,
        storageKey: stored.storageKey,
        updatedAt: new Date().toISOString(),
      });
    }

    const newGeneration = await createEditedGeneration(sourceGeneration, auth.uid, {
      sourceGenerationId: generationId || sourceGeneration?.id || "",
      prompt: storedPrompt,
      finalImageUrl: stored.publicUrl,
      storageKey: stored.storageKey,
      referenceName: sourceGeneration
        ? `${sourceGeneration.referenceName} · Edit`
        : "Edited photo",
    });

    await incrementEditsUsed(auth.uid);

    await logActivity(
      auth.uid,
      "photo_edit_completed",
      {
        editId,
        prompt: storedPrompt.slice(0, 200),
        retextureSkin,
        hasAttachment: Boolean(attachmentFalUrl),
      },
      {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    return NextResponse.json({
      generation: sanitizeGeneration(newGeneration),
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Edit failed";
    const message = humanizeEditError(toPublicErrorMessage(raw, "Edit failed"));
    console.log("[photos/edit] error", raw);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
