import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { removeWatermark, fetchImageBuffer } from "@/lib/watermark";
import { uploadProcessedImage } from "@/lib/storage";
import type { GenerationJob } from "@/lib/firebase/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[webhook/higgsfield] received", JSON.stringify(body).slice(0, 500));

    const jobId = body?.id || body?.job_set_id || body?.request_id;
    const status = body?.status || body?.jobs?.[0]?.status;
    const resultUrl =
      body?.jobs?.[0]?.results?.raw?.url ||
      body?.jobs?.[0]?.results?.min?.url ||
      body?.output?.url;

    if (!jobId) {
      return NextResponse.json({ received: true });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ received: true });
    }

    const db = getAdminDb();
    const genSnap = await db
      .collection(COLLECTIONS.generations)
      .where("higgsfieldJobId", "==", jobId)
      .limit(1)
      .get();

    if (genSnap.empty) {
      console.log("[webhook/higgsfield] no matching generation for", jobId);
      return NextResponse.json({ received: true });
    }

    const genDoc = genSnap.docs[0];
    const generation = genDoc.data() as GenerationJob;

    if (status === "failed" || status === "canceled") {
      await genDoc.ref.update({
        status: "failed",
        error: "Higgsfield job failed",
        updatedAt: new Date().toISOString(),
      });
      await logActivity(generation.userId, "generation_failed", { generationId: generation.id });
      return NextResponse.json({ received: true });
    }

    if (!resultUrl && status !== "completed") {
      return NextResponse.json({ received: true });
    }

    if (!resultUrl) {
      return NextResponse.json({ received: true, waiting: true });
    }

    await genDoc.ref.update({
      status: "watermark_removal",
      rawImageUrl: resultUrl,
      updatedAt: new Date().toISOString(),
    });

    const rawBuffer = await fetchImageBuffer(resultUrl);
    const cleanedBuffer = await removeWatermark(rawBuffer);
    const stored = await uploadProcessedImage(
      generation.userId,
      cleanedBuffer,
      `gen-${generation.id}`
    );

    await genDoc.ref.update({
      status: "completed",
      finalImageUrl: stored.publicUrl,
      storageKey: stored.storageKey,
      updatedAt: new Date().toISOString(),
    });

    await updateUser(generation.userId, { soulJobStatus: "completed" });

    await logActivity(generation.userId, "generation_completed", {
      generationId: generation.id,
      finalImageUrl: stored.publicUrl,
    });

    return NextResponse.json({ received: true, processed: true });
  } catch (err) {
    console.log("[webhook/higgsfield] error", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
