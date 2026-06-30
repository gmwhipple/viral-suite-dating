import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { removeWatermark, fetchImageBuffer } from "@/lib/watermark";
import { uploadProcessedImage } from "@/lib/storage";
import type { GenerationJob } from "@/lib/firebase/types";

export async function markGenerationFailed(
  generationId: string,
  userId: string,
  error: string
): Promise<void> {
  if (!isAdminConfigured()) return;

  await getAdminDb().collection(COLLECTIONS.generations).doc(generationId).update({
    status: "failed",
    error,
    updatedAt: new Date().toISOString(),
  });

  await logActivity(userId, "generation_failed", { generationId, error });
}

export async function completeGenerationFromUrl(
  generation: GenerationJob,
  resultUrl: string
): Promise<void> {
  if (!isAdminConfigured()) return;

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

  await genRef.update({
    status: "completed",
    finalImageUrl: stored.publicUrl,
    storageKey: stored.storageKey,
    updatedAt: new Date().toISOString(),
  });

  await updateUser(generation.userId, { soulJobStatus: "ready" });

  await logActivity(generation.userId, "generation_completed", {
    generationId: generation.id,
    finalImageUrl: stored.publicUrl,
  });
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
