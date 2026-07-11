import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { removeWatermark, fetchImageBuffer } from "@/lib/watermark";
import { uploadProcessedImage } from "@/lib/storage";
import { invalidateUserMediaCache } from "@/lib/dashboard-cache";
import type { GenerationJob } from "@/lib/firebase/types";

export async function markGenerationFailed(
  generationId: string,
  userId: string,
  error: string
): Promise<void> {
  if (!isAdminConfigured()) return;

  await logActivity(userId, "generation_failed", { generationId, error });

  await getAdminDb()
    .collection(COLLECTIONS.generations)
    .doc(generationId)
    .delete()
    .catch((err) => {
      console.log("[generation-completion] delete failed job error", generationId, err);
    });
}

export async function completeGenerationFromUrl(
  generation: GenerationJob,
  resultUrl: string
): Promise<GenerationJob> {
  if (!isAdminConfigured()) {
    return {
      ...generation,
      status: "completed",
      finalImageUrl: resultUrl,
      updatedAt: new Date().toISOString(),
    };
  }

  const genRef = getAdminDb().collection(COLLECTIONS.generations).doc(generation.id);

  await genRef.update({
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

  const completedAt = new Date().toISOString();
  const completed: GenerationJob = {
    ...generation,
    status: "completed",
    finalImageUrl: stored.publicUrl,
    storageKey: stored.storageKey,
    updatedAt: completedAt,
  };

  await genRef.delete().catch((err) => {
    console.log("[generation-completion] delete completed job error", generation.id, err);
  });

  await updateUser(generation.userId, { soulJobStatus: "ready" });

  await logActivity(generation.userId, "generation_completed", {
    generationId: generation.id,
    storageKey: stored.storageKey,
    finalImageUrl: stored.publicUrl,
  });

  invalidateUserMediaCache(generation.userId);

  return completed;
}

export function extractResultUrl(body: Record<string, unknown>): string | null {
  const images = body.images as Array<{ url?: string }> | undefined;
  const jobs = body.jobs as Array<{ results?: { raw?: { url?: string }; min?: { url?: string } } }> | undefined;
  const output = body.output as { url?: string } | undefined;

  return (
    images?.[0]?.url ||
    jobs?.[0]?.results?.raw?.url ||
    jobs?.[0]?.results?.min?.url ||
    output?.url ||
    null
  );
}
