import { getAdminDb, COLLECTIONS, isAdminConfigured, omitUndefined } from "@/lib/firebase/admin";
import type { UserProfile, UserPhoto, GenerationJob } from "@/lib/firebase/types";
import {
  DASHBOARD_GALLERY_LIMIT,
  MAX_GENERATIONS_PER_USER,
  MAX_EDITS_PER_USER,
  MAX_UPLOAD_PHOTOS,
  TRAINING_PHOTO_RETENTION_DAYS,
  TESTING_BYPASS_PAYMENT,
} from "@/lib/constants";
import path from "path";
import { deleteFromStorage } from "@/lib/storage";
import { claimPendingPurchase } from "@/lib/services/pending-purchases";
import {
  countUserTrainingPhotosFromStorage,
  isUserTrainingStorageKey,
  listUserCompletedGenerationsFromStorage,
  listUserTrainingPhotosFromStorage,
  purgeExpiredTrainingPhotosFromStorage,
  trainingPhotoId,
} from "@/lib/storage/user-media";

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string,
  options?: { claimPendingPurchase?: boolean }
): Promise<UserProfile> {
  if (!isAdminConfigured()) {
    return {
      uid,
      email,
      displayName,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 0,
      editsUsed: 0,
      editsLimit: 0,
      soulJobStatus: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const ref = getAdminDb().collection(COLLECTIONS.users).doc(uid);
  const snap = await ref.get();

  if (snap.exists) {
    const existing = snap.data() as UserProfile;
    if (options?.claimPendingPurchase) {
      await claimPendingPurchase(email, uid);
    }
    return existing;
  }

  const user: UserProfile = {
    uid,
    email,
    plan: "free",
    generationsUsed: 0,
    generationsLimit: 0,
    editsUsed: 0,
    editsLimit: 0,
    soulJobStatus: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(displayName ? { displayName } : {}),
  };

  await ref.set(omitUndefined(user));
  if (options?.claimPendingPurchase) {
    await claimPendingPurchase(email, uid);
  }
  return user;
}

export async function updateUser(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  if (!isAdminConfigured()) return;
  await getAdminDb()
    .collection(COLLECTIONS.users)
    .doc(uid)
    .update(omitUndefined({ ...data, updatedAt: new Date().toISOString() }));
}

export async function activatePaidPlan(uid: string, stripeCustomerId: string) {
  await updateUser(uid, {
    plan: "paid",
    stripeCustomerId,
    generationsLimit: MAX_GENERATIONS_PER_USER,
    generationsUsed: 0,
    editsLimit: MAX_EDITS_PER_USER,
    editsUsed: 0,
  });
}

/** Training photos — listed from B2/CDN storage, not Firestore. */
export async function getUserPhotos(
  userId: string,
  baseUrl?: string
): Promise<UserPhoto[]> {
  return listUserTrainingPhotosFromStorage(userId, baseUrl);
}

export async function countUserPhotos(userId: string): Promise<number> {
  return countUserTrainingPhotosFromStorage(userId);
}

export async function deleteUserPhotoByStorageKey(
  userId: string,
  storageKey: string
): Promise<UserPhoto | null> {
  if (!isUserTrainingStorageKey(userId, storageKey)) return null;

  await deleteFromStorage(storageKey);

  return {
    id: trainingPhotoId(storageKey),
    userId,
    storageKey,
    publicUrl: "",
    fileName: path.basename(storageKey),
    fileSize: 0,
    mimeType: "image/jpeg",
    uploadedAt: new Date().toISOString(),
  };
}

export function trainingPhotoRetentionExpiresAt(uploadedAt: string): string {
  const expires = new Date(uploadedAt);
  expires.setUTCDate(expires.getUTCDate() + TRAINING_PHOTO_RETENTION_DAYS);
  return expires.toISOString();
}

export async function purgeExpiredTrainingPhotos(userId: string): Promise<number> {
  return purgeExpiredTrainingPhotosFromStorage(userId);
}

export async function assertCanUploadTrainingPhoto(userId: string): Promise<void> {
  const count = await countUserTrainingPhotosFromStorage(userId);
  if (count >= MAX_UPLOAD_PHOTOS) {
    throw new Error(`Maximum ${MAX_UPLOAD_PHOTOS} photos allowed`);
  }
}

/** @deprecated Firestore photo docs are no longer written — use storage keys. */
export async function saveUserPhoto(_photo: UserPhoto): Promise<void> {
  return;
}

/** @deprecated Use deleteUserPhotoByStorageKey */
export async function deleteUserPhoto(
  userId: string,
  photoId: string
): Promise<UserPhoto | null> {
  return deleteUserPhotoByStorageKey(userId, photoId);
}

/** @deprecated Use deleteUserPhotoByStorageKey */
export async function getUserPhoto(
  userId: string,
  photoId: string
): Promise<UserPhoto | null> {
  const photos = await listUserTrainingPhotosFromStorage(userId);
  return photos.find((p) => p.id === photoId || p.storageKey === photoId) || null;
}

/** Completed gallery — listed from B2/CDN; pending jobs stay in Firestore. */
export async function getUserGenerations(
  userId: string,
  baseUrl?: string,
  limit = DASHBOARD_GALLERY_LIMIT
): Promise<GenerationJob[]> {
  const [completed, pending] = await Promise.all([
    listUserCompletedGenerationsFromStorage(userId, baseUrl, limit),
    getPollablePendingGenerations(userId),
  ]);

  const merged = [...pending, ...completed].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return merged.slice(0, limit);
}

/** Statuses that may still need a Higgsfield status poll */
const POLLABLE_GENERATION_STATUSES: GenerationJob["status"][] = ["queued", "processing"];

export async function getPollablePendingGenerations(userId: string): Promise<GenerationJob[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.generations)
    .where("userId", "==", userId)
    .where("status", "in", POLLABLE_GENERATION_STATUSES)
    .get();

  return snap.docs
    .map((d) => d.data() as GenerationJob)
    .filter((g) => Boolean(g.higgsfieldJobId));
}

/** @deprecated Use getPollablePendingGenerations for remote sync */
export async function getPendingGenerations(userId: string): Promise<GenerationJob[]> {
  return getPollablePendingGenerations(userId);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isAdminConfigured()) return null;
  const snap = await getAdminDb().collection(COLLECTIONS.users).doc(userId).get();
  if (!snap.exists) return null;
  return snap.data() as UserProfile;
}

export function canUserGenerate(user: UserProfile): boolean {
  if (TESTING_BYPASS_PAYMENT) {
    return user.generationsUsed < MAX_GENERATIONS_PER_USER;
  }
  if (user.plan !== "paid") return false;
  return user.generationsUsed < user.generationsLimit;
}

export async function incrementGenerationsUsed(uid: string): Promise<void> {
  if (!isAdminConfigured()) return;
  const ref = getAdminDb().collection(COLLECTIONS.users).doc(uid);
  await getAdminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const user = snap.data() as UserProfile;
    tx.update(ref, {
      generationsUsed: (user.generationsUsed || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  });
}

export function canUserEdit(user: UserProfile): boolean {
  if (TESTING_BYPASS_PAYMENT) {
    return (user.editsUsed || 0) < MAX_EDITS_PER_USER;
  }
  if (user.plan !== "paid") return false;
  return (user.editsUsed || 0) < (user.editsLimit || 0);
}

export async function incrementEditsUsed(uid: string): Promise<void> {
  if (!isAdminConfigured()) return;
  const ref = getAdminDb().collection(COLLECTIONS.users).doc(uid);
  await getAdminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const user = snap.data() as UserProfile;
    tx.update(ref, {
      editsUsed: (user.editsUsed || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  });
}

export { trainingPhotoId };
