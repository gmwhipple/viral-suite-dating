import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { getOrCreateUser, canUserGenerate, incrementGenerationsUsed } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { generateSoulImage, isHiggsfieldConfigured } from "@/lib/higgsfield";
import { resolveImageReference } from "@/lib/reference-storage";
import { getExternalFetchUrl } from "@/lib/storage";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import styleReferences from "@/data/style-references.json";
import type { GenerationJob } from "@/lib/firebase/types";
import { DEFAULT_SOUL_GENERATION_PROMPT, TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { v4 as uuidv4 } from "uuid";

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
    } = body as {
      storageKey?: string;
      imageReferenceUrl?: string;
      referenceName?: string;
      prompt?: string;
      referenceId?: string;
    };

    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);

    if (user.soulJobStatus !== "ready" || !user.soulReferenceId) {
      return NextResponse.json({ error: "Character not ready yet" }, { status: 400 });
    }

    if (!canUserGenerate(user)) {
      return NextResponse.json({
        error: !TESTING_BYPASS_PAYMENT && user.plan !== "paid"
          ? "Purchase a plan to generate photos"
          : "Generation limit reached (100 max)",
      }, { status: 403 });
    }

    let resolvedUrl = imageReferenceUrl;
    let resolvedName = referenceName || "Custom reference";
    let resolvedPrompt = prompt || DEFAULT_SOUL_GENERATION_PROMPT;
    let resolvedReferenceId = referenceId || storageKey || "custom";
    let resolvedStorageKey = storageKey;

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

    if (!resolvedUrl) {
      return NextResponse.json({ error: "imageReferenceUrl or storageKey required" }, { status: 400 });
    }

    const externalReferenceUrl = resolvedStorageKey
      ? await getExternalFetchUrl(resolvedStorageKey, baseUrl)
      : resolvedUrl;

    console.log("[soul/generate] starting", {
      uid: auth.uid.slice(0, 8),
      storageKey: resolvedStorageKey,
      referenceHost: (() => {
        try {
          return new URL(externalReferenceUrl).host;
        } catch {
          return "invalid";
        }
      })(),
    });

    const appUrl = baseUrl;
    const jobId = uuidv4();

    const generation: GenerationJob = {
      id: jobId,
      userId: auth.uid,
      referenceId: resolvedReferenceId,
      referenceName: resolvedName,
      prompt: resolvedPrompt,
      imageReferenceUrl: resolvedUrl,
      imageReferenceKey: resolvedStorageKey,
      status: "queued",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).set(generation);
    }

    const job = await generateSoulImage({
      soulReferenceId: user.soulReferenceId,
      prompt: resolvedPrompt,
      imageReferenceUrl: externalReferenceUrl,
      webhookUrl: `${appUrl}/api/webhooks/higgsfield`,
    });

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).update({
        higgsfieldJobId: job.id,
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
      generation: { ...generation, higgsfieldJobId: job.id, status: "processing" },
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message.replace(/^Request failed with status code \d+$/, "Generation service error")
        : "Generation failed";
    console.log("[soul/generate] error", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function updateUserStatus(uid: string, status: "generating") {
  const { updateUser } = await import("@/lib/services/users");
  await updateUser(uid, { soulJobStatus: status });
}
