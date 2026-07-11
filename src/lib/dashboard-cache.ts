import type { GenerationJob, UserPhoto } from "@/lib/firebase/types";
import {
  listUserCompletedGenerationsFromStorage,
  listUserTrainingPhotosFromStorage,
} from "@/lib/storage/user-media";

type MediaCacheEntry = {
  photos: UserPhoto[];
  completedGenerations: GenerationJob[];
  expiresAt: number;
};

const mediaCache = new Map<string, MediaCacheEntry>();
const claimCooldown = new Map<string, number>();

export function shouldClaimPendingPurchase(uid: string, cooldownMs: number): boolean {
  const until = claimCooldown.get(uid);
  if (until && until > Date.now()) return false;
  claimCooldown.set(uid, Date.now() + cooldownMs);
  return true;
}

export function invalidateUserMediaCache(userId: string): void {
  for (const key of mediaCache.keys()) {
    if (key.startsWith(`${userId}:`)) {
      mediaCache.delete(key);
    }
  }
}

export async function getCachedUserMedia(
  userId: string,
  baseUrl: string,
  ttlMs: number,
  generationLimit: number
): Promise<{ photos: UserPhoto[]; completedGenerations: GenerationJob[] }> {
  const key = `${userId}:${baseUrl}:${generationLimit}`;
  const hit = mediaCache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return {
      photos: hit.photos,
      completedGenerations: hit.completedGenerations,
    };
  }

  const [photos, completedGenerations] = await Promise.all([
    listUserTrainingPhotosFromStorage(userId, baseUrl),
    listUserCompletedGenerationsFromStorage(userId, baseUrl, generationLimit),
  ]);

  mediaCache.set(key, {
    photos,
    completedGenerations,
    expiresAt: Date.now() + ttlMs,
  });

  return { photos, completedGenerations };
}
