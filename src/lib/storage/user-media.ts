import path from "path";
import type { GenerationJob, UserPhoto } from "@/lib/firebase/types";
import { DASHBOARD_GALLERY_LIMIT } from "@/lib/constants";
import { trainingPhotoRetentionExpiresAt } from "@/lib/services/users";
import { getStoragePublicUrl } from "@/lib/storage";
import { listStorageObjectsWithMeta } from "@/lib/storage/list-objects";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function isImageKey(storageKey: string): boolean {
  return IMAGE_EXT.has(path.extname(storageKey).toLowerCase());
}

function mimeFromKey(storageKey: string): string {
  const ext = path.extname(storageKey).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function trainingPrefix(userId: string): string {
  return `users/${userId}/training/`;
}

function generationsPrefix(userId: string): string {
  return `users/${userId}/generations/`;
}

/** Stable id for UI — storage key is the source of truth. */
export function trainingPhotoId(storageKey: string): string {
  return storageKey;
}

export function generationIdFromStorageKey(storageKey: string): string {
  const base = path.basename(storageKey, path.extname(storageKey));
  const genMatch = base.match(/^gen-([0-9a-f-]{36})-/i);
  if (genMatch) return genMatch[1];
  return base;
}

export async function listUserTrainingPhotosFromStorage(
  userId: string,
  baseUrl?: string
): Promise<UserPhoto[]> {
  const prefix = trainingPrefix(userId);
  const objects = (await listStorageObjectsWithMeta(prefix))
    .filter((obj) => isImageKey(obj.storageKey))
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

  return objects.map((obj) => {
    const fileName = path.basename(obj.storageKey);
    const uploadedAt = obj.lastModified;
    return {
      id: trainingPhotoId(obj.storageKey),
      userId,
      storageKey: obj.storageKey,
      publicUrl: getStoragePublicUrl(obj.storageKey, baseUrl),
      fileName,
      fileSize: obj.size,
      mimeType: mimeFromKey(obj.storageKey),
      uploadedAt,
      retentionExpiresAt: trainingPhotoRetentionExpiresAt(uploadedAt),
    };
  });
}

export async function countUserTrainingPhotosFromStorage(userId: string): Promise<number> {
  const prefix = trainingPrefix(userId);
  const objects = await listStorageObjectsWithMeta(prefix);
  return objects.filter((obj) => isImageKey(obj.storageKey)).length;
}

export async function listUserCompletedGenerationsFromStorage(
  userId: string,
  baseUrl?: string,
  limit = DASHBOARD_GALLERY_LIMIT
): Promise<GenerationJob[]> {
  const prefix = generationsPrefix(userId);
  const objects = (await listStorageObjectsWithMeta(prefix))
    .filter((obj) => isImageKey(obj.storageKey))
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    .slice(0, limit);

  return objects.map((obj) => {
    const id = generationIdFromStorageKey(obj.storageKey);
    const ts = obj.lastModified;
    return {
      id,
      userId,
      referenceId: "storage",
      referenceName: "Generated photo",
      prompt: "",
      status: "completed" as const,
      finalImageUrl: getStoragePublicUrl(obj.storageKey, baseUrl),
      storageKey: obj.storageKey,
      createdAt: ts,
      updatedAt: ts,
    };
  });
}

export function isUserTrainingStorageKey(userId: string, storageKey: string): boolean {
  return storageKey.startsWith(trainingPrefix(userId)) && isImageKey(storageKey);
}

export function isUserGenerationStorageKey(userId: string, storageKey: string): boolean {
  return storageKey.startsWith(generationsPrefix(userId)) && isImageKey(storageKey);
}

export async function purgeExpiredTrainingPhotosFromStorage(userId: string): Promise<number> {
  const now = Date.now();
  const photos = await listUserTrainingPhotosFromStorage(userId);
  let purged = 0;

  for (const photo of photos) {
    const expiresAt = photo.retentionExpiresAt || trainingPhotoRetentionExpiresAt(photo.uploadedAt);
    if (new Date(expiresAt).getTime() > now) continue;

    const { deleteFromStorage } = await import("@/lib/storage");
    try {
      await deleteFromStorage(photo.storageKey);
      purged += 1;
    } catch (err) {
      console.log("[user-media] purge error", photo.storageKey, err);
    }
  }

  if (purged > 0) {
    console.log("[user-media] purged expired training photos", {
      userId: userId.slice(0, 8),
      purged,
    });
  }

  return purged;
}
