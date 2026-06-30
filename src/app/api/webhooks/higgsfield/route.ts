import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import {
  completeGenerationFromUrl,
  extractResultUrl,
  markGenerationFailed,
} from "@/lib/generation-completion";
import type { GenerationJob } from "@/lib/firebase/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[webhook/higgsfield] received", JSON.stringify(body).slice(0, 500));

    const jobId =
      body?.id ||
      body?.job_set_id ||
      body?.request_id ||
      body?.requestId;
    const status = body?.status || body?.jobs?.[0]?.status;
    const resultUrl = extractResultUrl(body);

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

    if (status === "failed" || status === "canceled" || status === "nsfw") {
      await markGenerationFailed(generation.id, generation.userId, "Generation did not complete");
      return NextResponse.json({ received: true });
    }

    if (!resultUrl && status !== "completed") {
      return NextResponse.json({ received: true });
    }

    if (!resultUrl) {
      return NextResponse.json({ received: true, waiting: true });
    }

    await completeGenerationFromUrl(generation, resultUrl);

    return NextResponse.json({ received: true, processed: true });
  } catch (err) {
    console.log("[webhook/higgsfield] error", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
