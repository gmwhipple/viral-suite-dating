import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { getOrCreateUser, canUserGenerate, incrementGenerationsUsed, getPollablePendingGenerations } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { generateSoulImage, isHiggsfieldConfigured, pollGenerationRequest } from "@/lib/higgsfield";
import {
  completeGenerationFromUrl,
  extractResultUrl,
  markGenerationFailed,
} from "@/lib/generation-completion";
import { getCharacter, isCharacterReady } from "@/lib/services/characters";
import { resolveImageReference } from "@/lib/reference-storage";
import { resolvePromptOnlySoulStyle } from "@/lib/soul-default-style";
import { getExternalFetchUrl } from "@/lib/storage";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import styleReferences from "@/data/style-references.json";
import type { GenerationJob } from "@/lib/firebase/types";
import {
  MAX_GENERATIONS_PER_USER,
  TESTING_BYPASS_PAYMENT,
  withSoulSubjectInstruction,
} from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { sanitizeGeneration } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const pending = await getPollablePendingGenerations(auth.uid);

    let synced = 0;

    for (const generation of pending) {
      const status = await pollGenerationRequest(generation.higgsfieldJobId!);
      if (!status) continue;

      console.log("[photos/generate] poll", {
        generationId: generation.id,
        remoteStatus: status.status,
      });

      if (status.status === "failed" || status.status === "nsfw" || status.status === "canceled") {
        await markGenerationFailed(
          generation.id,
          generation.userId,
          "Generation did not complete"
        );
        synced += 1;
        continue;
      }

      if (status.status !== "completed") continue;

      const resultUrl = extractResultUrl(status as Record<string, unknown>);
      if (!resultUrl) continue;

      await completeGenerationFromUrl(generation, resultUrl);
      synced += 1;
    }

    return NextResponse.json({ synced, pending: pending.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.log("[photos/generate] sync error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      storageKey,
      imageReferenceUrl,
      referenceName,
      prompt,
      referenceId,
      characterId: bodyCharacterId,
      enhancePrompt,
      styleId,
      styleName,
    } = body as {
      storageKey?: string;
      imageReferenceUrl?: string;
      referenceName?: string;
      prompt?: string;
      referenceId?: string;
      characterId?: string;
      enhancePrompt?: boolean;
      styleId?: string;
      styleName?: string;
    };

    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    const characterId = bodyCharacterId || user.activeCharacterId;
    if (!characterId) {
      return NextResponse.json({ error: "Select a character first" }, { status: 400 });
    }

    const character = await getCharacter(auth.uid, characterId);
    if (!character || character.status !== "ready") {
      return NextResponse.json({ error: "Selected character is not ready yet" }, { status: 400 });
    }

    const soulReferenceId = character.soulReferenceId || user.soulReferenceId;
    if (!soulReferenceId) {
      return NextResponse.json(
        { error: "Selected character is missing its trained model. Retrain or pick another character." },
        { status: 400 }
      );
    }

    if (!isCharacterReady({ ...character, soulReferenceId })) {
      return NextResponse.json({ error: "Selected character is not ready yet" }, { status: 400 });
    }

    if (!canUserGenerate(user)) {
      return NextResponse.json({
        error: !TESTING_BYPASS_PAYMENT && user.plan !== "paid"
          ? "Purchase a plan to generate photos"
          : `Generation limit reached (${MAX_GENERATIONS_PER_USER} max)`,
      }, { status: 403 });
    }

    let resolvedUrl = imageReferenceUrl;
    let resolvedName = referenceName || "Custom reference";
    let resolvedPrompt = prompt?.trim() || "";
    let resolvedReferenceId = referenceId || storageKey || "custom";
    let resolvedStorageKey = storageKey;
    let resolvedStyleId = styleId?.trim() || undefined;
    let resolvedStyleName = styleName?.trim() || undefined;

    const baseUrl = getAppBaseUrl(request);

    if (storageKey) {
      const ref = await resolveImageReference(auth.uid, storageKey, baseUrl);
      if (!ref) {
        return NextResponse.json({ error: "Invalid reference image" }, { status: 400 });
      }
      resolvedUrl = ref.publicUrl;
      resolvedName = ref.name;
      resolvedReferenceId = ref.id;
      resolvedStorageKey = ref.storageKey;
    } else if (referenceId) {
      const builtin = styleReferences.find((r) => r.id === referenceId);
      if (!builtin) {
        return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
      }
      resolvedUrl = builtin.thumbnailUrl;
      resolvedName = builtin.name;
      resolvedPrompt = builtin.prompt;
      resolvedReferenceId = builtin.id;
    }

    const hasReferenceImage = Boolean(resolvedStorageKey || resolvedUrl);

    if (!resolvedPrompt?.trim() && !hasReferenceImage) {
      return NextResponse.json({ error: "Enter a prompt or select a reference image" }, { status: 400 });
    }

    if (!hasReferenceImage) {
      const defaultStyle = await resolvePromptOnlySoulStyle();
      resolvedStyleId = defaultStyle.id;
      resolvedStyleName = defaultStyle.name;
      console.log("[photos/generate] auto-applied prompt-only style", {
        styleId: resolvedStyleId,
        styleName: resolvedStyleName,
      });
    }

    if (!resolvedUrl && !resolvedStyleId) {
      resolvedName = "Text prompt";
      resolvedReferenceId = "prompt-only";
    }

    resolvedPrompt = withSoulSubjectInstruction(resolvedPrompt);

    const externalReferenceUrl = resolvedStorageKey && resolvedUrl
      ? await getExternalFetchUrl(resolvedStorageKey, baseUrl)
      : resolvedUrl;

    console.log("[photos/generate] starting", {
      uid: auth.uid.slice(0, 8),
      characterId,
      soulReferenceId: soulReferenceId.slice(0, 8),
      storageKey: resolvedStorageKey,
      styleId: resolvedStyleId ?? null,
      hasReference: Boolean(externalReferenceUrl),
      referenceHost: (() => {
        if (!externalReferenceUrl) return null;
        try {
          return new URL(externalReferenceUrl).host;
        } catch {
          return "invalid";
        }
      })(),
    });

    const jobId = uuidv4();

    const generation: GenerationJob = {
      id: jobId,
      userId: auth.uid,
      characterId,
      referenceId: resolvedReferenceId,
      referenceName: resolvedUrl ? resolvedName : resolvedStyleName || "Text prompt",
      prompt: resolvedPrompt,
      imageReferenceUrl: resolvedUrl,
      imageReferenceKey: resolvedStorageKey,
      soulStyleId: resolvedStyleId,
      soulStyleName: resolvedStyleName,
      status: "queued",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).set(generation);
    }

    const job = await generateSoulImage({
      soulReferenceId,
      prompt: resolvedPrompt,
      imageReferenceUrl: externalReferenceUrl,
      styleId: resolvedStyleId,
      enhancePrompt: enhancePrompt !== false,
    });

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).update({
        higgsfieldJobId: job.id,
        higgsfieldStatusUrl: job.statusUrl,
        status: "processing",
        updatedAt: new Date().toISOString(),
      });
    }

    await incrementGenerationsUsed(auth.uid);
    await updateUserStatus(auth.uid, "generating");

    await logActivity(auth.uid, "generation_started", {
      generationId: jobId,
      referenceId: resolvedReferenceId,
      higgsfieldJobId: job.id,
      imageReferenceUrl: resolvedUrl,
      imageReferenceKey: resolvedStorageKey,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      generation: sanitizeGeneration({
        ...generation,
        higgsfieldJobId: job.id,
        status: "processing",
      }),
    });
  } catch (err) {
    const message = toPublicErrorMessage(err, "Generation failed");
    console.log("[photos/generate] error", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function updateUserStatus(uid: string, status: "generating") {
  const { updateUser } = await import("@/lib/services/users");
  await updateUser(uid, { soulJobStatus: status });
}
