import { getStorage } from "firebase-admin/storage";
import { getAdminApp, isAdminConfigured } from "@/lib/firebase/admin";
import { STORAGE_IMAGE_CACHE_CONTROL } from "@/lib/constants";

function getBucketName(): string {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    ""
  );
}

export function isFirebaseStorageConfigured(): boolean {
  return isAdminConfigured() && Boolean(getBucketName());
}

export function getAdminBucket() {
  if (!isFirebaseStorageConfigured()) {
    throw new Error("Firebase Storage is not configured");
  }
  return getStorage(getAdminApp()).bucket(getBucketName());
}

export async function uploadToFirebaseStorage(
  storageKey: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const file = getAdminBucket().file(storageKey);
  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl: STORAGE_IMAGE_CACHE_CONTROL,
    },
    resumable: false,
  });
}

export async function downloadFromFirebaseStorage(storageKey: string): Promise<Buffer> {
  const [buffer] = await getAdminBucket().file(storageKey).download();
  return buffer;
}

export async function listFirebaseStoragePrefix(prefix: string): Promise<string[]> {
  const [files] = await getAdminBucket().getFiles({ prefix, maxResults: 500 });
  return files.map((file) => file.name);
}

export async function existsInFirebaseStorage(storageKey: string): Promise<boolean> {
  const [exists] = await getAdminBucket().file(storageKey).exists();
  return exists;
}

export async function deleteFromFirebaseStorage(storageKey: string): Promise<void> {
  await getAdminBucket().file(storageKey).delete({ ignoreNotFound: true });
}

/** Public HTTPS URL Higgsfield can fetch (signed, ~2h). */
export async function getFirebaseSignedReadUrl(
  storageKey: string,
  expiresMs = 2 * 60 * 60 * 1000
): Promise<string> {
  const [url] = await getAdminBucket().file(storageKey).getSignedUrl({
    action: "read",
    expires: Date.now() + expiresMs,
  });
  return url;
}
