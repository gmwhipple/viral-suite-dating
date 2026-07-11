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
import { deleteFromStorage } from "@/lib/storage";
import { claimPendingPurchase } from "@/lib/services/pending-purchases";

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string
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
    await claimPendingPurchase(email, uid);
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
  await claimPendingPurchase(email, uid);
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

export async function getUserPhotos(userId: string): Promise<UserPhoto[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.photos)
    .where("userId", "==", userId)
    .get();

  return snap.docs
    .map((d) => d.data() as UserPhoto)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function countUserPhotos(userId: string): Promise<number> {
  if (!isAdminConfigured()) return 0;
  const snap = await getAdminDb()
    .collection(COLLECTIONS.photos)
    .where("userId", "==", userId)
    .count()
    .get();
  return snap.data().count;
}

export async function saveUserPhoto(photo: UserPhoto): Promise<void> {
  if (!isAdminConfigured()) return;
  const count = await countUserPhotos(photo.userId);
  if (count >= MAX_UPLOAD_PHOTOS) {
    throw new Error(`Maximum ${MAX_UPLOAD_PHOTOS} photos allowed`);
  }
  await getAdminDb().collection(COLLECTIONS.photos).doc(photo.id).set(photo);
}

export async function deleteUserPhoto(
  userId: string,
  photoId: string
): Promise<UserPhoto | null> {
  if (!isAdminConfigured()) return null;

  const ref = getAdminDb().collection(COLLECTIONS.photos).doc(photoId);
  const snap = await ref.get();
  if (!snap.exists) return null;

  const photo = snap.data() as UserPhoto;
  if (photo.userId !== userId) return null;

  await ref.delete();
  return photo;
}

export function trainingPhotoRetentionExpiresAt(uploadedAt: string): string {
  const expires = new Date(uploadedAt);
  expires.setUTCDate(expires.getUTCDate() + TRAINING_PHOTO_RETENTION_DAYS);
  return expires.toISOString();
}

export async function purgeExpiredTrainingPhotos(userId: string): Promise<number> {
  if (!isAdminConfigured()) return 0;

  const photos = await getUserPhotos(userId);
  const now = Date.now();
  let purged = 0;

  for (const photo of photos) {
    const expiresAt = photo.retentionExpiresAt || trainingPhotoRetentionExpiresAt(photo.uploadedAt);
    if (new Date(expiresAt).getTime() > now) continue;

    try {
      await deleteFromStorage(photo.storageKey);
    } catch (err) {
      console.log("[users] purge storage error", photo.storageKey, err);
    }
    await getAdminDb().collection(COLLECTIONS.photos).doc(photo.id).delete();
    purged += 1;
  }

  if (purged > 0) {
    console.log("[users] purged expired training photos", { userId: userId.slice(0, 8), purged });
  }

  return purged;
}

export async function getUserPhoto(
  userId: string,
  photoId: string
): Promise<UserPhoto | null> {
  if (!isAdminConfigured()) return null;

  const snap = await getAdminDb().collection(COLLECTIONS.photos).doc(photoId).get();
  if (!snap.exists) return null;

  const photo = snap.data() as UserPhoto;
  if (photo.userId !== userId) return null;
  return photo;
}

export async function getUserGenerations(
  userId: string,
  limit = DASHBOARD_GALLERY_LIMIT
): Promise<GenerationJob[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.generations)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => d.data() as GenerationJob);
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
