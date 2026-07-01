import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { applyEmotionEdit, isAILabConfigured, SMILE_OPTIONS } from "@/lib/ailab";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { uploadProcessedImage } from "@/lib/storage";
import { removeWatermark } from "@/lib/watermark";
import type { EditJob, GenerationJob } from "@/lib/firebase/types";
import { v4 as uuidv4 } from "uuid";

const VALID_CHOICES = new Set(SMILE_OPTIONS.map((o) => o.serviceChoice));

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAILabConfigured()) {
    return NextResponse.json({ error: "AI Labs is not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { sourceImageUrl, serviceChoice, generationId } = body as {
      sourceImageUrl?: string;
      serviceChoice?: number;
      generationId?: string;
    };

    if (!sourceImageUrl) {
      return NextResponse.json({ error: "sourceImageUrl required" }, { status: 400 });
    }

    if (!serviceChoice || !VALID_CHOICES.has(serviceChoice as 11 | 12 | 13)) {
      return NextResponse.json({ error: "Invalid smile option" }, { status: 400 });
    }

    const { imageBuffer, requestId } = await applyEmotionEdit(
      sourceImageUrl,
      serviceChoice as 11 | 12 | 13
    );
    const cleanedBuffer = await removeWatermark(imageBuffer);
    const stored = await uploadProcessedImage(
      auth.uid,
      cleanedBuffer,
      `smile-${serviceChoice}-${uuidv4().slice(0, 8)}`
    );

    if (generationId && isAdminConfigured()) {
      const genRef = getAdminDb().collection(COLLECTIONS.generations).doc(generationId);
      const genSnap = await genRef.get();
      if (genSnap.exists) {
        const generation = genSnap.data() as GenerationJob;
        if (generation.userId === auth.uid) {
          await genRef.update({
            finalImageUrl: stored.publicUrl,
            storageKey: stored.storageKey,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    const editId = uuidv4();
    const editJob: EditJob = {
      id: editId,
      userId: auth.uid,
      sourceGenerationId: generationId || "",
      prompt: `smile:${serviceChoice}`,
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

    await logActivity(
      auth.uid,
      "photo_smile_applied",
      { editId, serviceChoice, generationId, ailabRequestId: requestId },
      {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    return NextResponse.json({
      imageUrl: stored.publicUrl,
      edit: editJob,
      requestId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Smile edit failed";
    console.log("[ailab/smile] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
