import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { getOrCreateUser, canUserGenerate, incrementGenerationsUsed } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { generateSoulImage, isHiggsfieldConfigured } from "@/lib/higgsfield";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import styleReferences from "@/data/style-references.json";
import type { GenerationJob } from "@/lib/firebase/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "Higgsfield not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { referenceId } = body as { referenceId?: string };

    if (!referenceId) {
      return NextResponse.json({ error: "referenceId required" }, { status: 400 });
    }

    const user = await getOrCreateUser(auth.uid, auth.email);

    if (user.soulJobStatus !== "ready" || !user.soulReferenceId) {
      return NextResponse.json({ error: "Character not ready yet" }, { status: 400 });
    }

    if (!canUserGenerate(user)) {
      return NextResponse.json({
        error: user.plan !== "paid"
          ? "Purchase a plan to generate photos"
          : "Generation limit reached (100 max)",
      }, { status: 403 });
    }

    const reference = styleReferences.find((r) => r.id === referenceId);
    if (!reference) {
      return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const jobId = uuidv4();

    const generation: GenerationJob = {
      id: jobId,
      userId: auth.uid,
      referenceId: reference.id,
      referenceName: reference.name,
      prompt: reference.prompt,
      status: "queued",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).set(generation);
    }

    const jobSet = await generateSoulImage({
      soulReferenceId: user.soulReferenceId,
      prompt: reference.prompt,
      webhookUrl: `${appUrl}/api/webhooks/higgsfield`,
    });

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.generations).doc(jobId).update({
        higgsfieldJobId: jobSet.id,
        status: "processing",
        updatedAt: new Date().toISOString(),
      });
    }

    await incrementGenerationsUsed(auth.uid);
    await updateUserStatus(auth.uid, "generating");

    await logActivity(auth.uid, "generation_started", {
      generationId: jobId,
      referenceId: reference.id,
      higgsfieldJobId: jobSet.id,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ generation: { ...generation, higgsfieldJobId: jobSet.id, status: "processing" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.log("[soul/generate] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function updateUserStatus(uid: string, status: "generating") {
  const { updateUser } = await import("@/lib/services/users");
  await updateUser(uid, { soulJobStatus: status });
}
