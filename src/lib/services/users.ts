import { getAdminDb, COLLECTIONS, isAdminConfigured, omitUndefined } from "@/lib/firebase/admin";
import type { UserProfile, UserPhoto, GenerationJob } from "@/lib/firebase/types";
import { MAX_GENERATIONS_PER_USER, MAX_UPLOAD_PHOTOS, TESTING_BYPASS_PAYMENT } from "@/lib/constants";

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
      soulJobStatus: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const ref = getAdminDb().collection(COLLECTIONS.users).doc(uid);
  const snap = await ref.get();

  if (snap.exists) {
    return snap.data() as UserProfile;
  }

  const user: UserProfile = {
    uid,
    email,
    plan: "free",
    generationsUsed: 0,
    generationsLimit: 0,
    soulJobStatus: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(displayName ? { displayName } : {}),
  };

  await ref.set(omitUndefined(user));
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

export async function getUserGenerations(userId: string): Promise<GenerationJob[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.generations)
    .where("userId", "==", userId)
    .get();

  return snap.docs
    .map((d) => d.data() as GenerationJob)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
