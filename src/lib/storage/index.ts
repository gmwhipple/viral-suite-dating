import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  downloadFromB2Storage,
  deleteFromB2Storage,
  existsInB2Storage,
  getB2PresignedReadUrl,
  isB2StorageConfigured,
  listB2StoragePrefix,
  uploadToB2Storage,
} from "@/lib/b2/storage";
import {
  downloadFromFirebaseStorage,
  isFirebaseStorageConfigured,
  listFirebaseStoragePrefix,
  uploadToFirebaseStorage,
  existsInFirebaseStorage,
} from "@/lib/firebase/storage";
import { getAppBaseUrl } from "@/lib/app-url";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");

export interface StorageResult {
  storageKey: string;
  publicUrl: string;
}

function useB2(): boolean {
  return isB2StorageConfigured();
}

function useFirebase(): boolean {
  return !useB2() && isFirebaseStorageConfigured();
}

/** Cloudflare (or other CDN) base — B2 Bandwidth Alliance avoids B2 egress. */
export function getStorageCdnBaseUrl(): string | undefined {
  const cdn =
    process.env.NEXT_PUBLIC_STORAGE_CDN_URL?.trim() ||
    process.env.STORAGE_CDN_URL?.trim();
  return cdn ? cdn.replace(/\/$/, "") : undefined;
}

export function encodeStorageKeyForUrl(storageKey: string): string {
  return storageKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function decodeStorageKeyFromUrl(encodedPath: string): string {
  return encodedPath
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

export function getStoragePublicUrl(storageKey: string, baseUrl?: string): string {
  const encoded = encodeStorageKeyForUrl(storageKey);
  const cdnBase = getStorageCdnBaseUrl();
  if (cdnBase) {
    return `${cdnBase}/${encoded}`;
  }

  const base = (baseUrl || getAppBaseUrl()).replace(/\/$/, "");
  return `${base}/api/storage/${encoded}`;
}

function parseStorageKeyFromPathname(pathname: string): string | null {
  const appMatch = pathname.match(/^\/api\/storage\/(.+)$/);
  if (appMatch?.[1]) {
    return decodeStorageKeyFromUrl(appMatch[1]);
  }

  const cdnMatch = pathname.match(/^\/(.+)$/);
  if (cdnMatch?.[1]) {
    return decodeStorageKeyFromUrl(cdnMatch[1]);
  }

  return null;
}

/** Parse app or CDN storage URLs back to a storage key. */
export function getStorageKeyFromPublicUrl(
  publicUrl: string,
  baseUrl?: string
): string | null {
  try {
    const parsed = new URL(publicUrl);
    const cdnBase = getStorageCdnBaseUrl();
    if (cdnBase) {
      const cdn = new URL(cdnBase);
      if (parsed.origin === cdn.origin) {
        return parseStorageKeyFromPathname(parsed.pathname);
      }
    }

    const key = parseStorageKeyFromPathname(parsed.pathname);
    if (key) return key;
  } catch {
    // fall through to prefix match
  }

  const cdnBase = getStorageCdnBaseUrl();
  if (cdnBase && publicUrl.startsWith(`${cdnBase}/`)) {
    return decodeStorageKeyFromUrl(publicUrl.slice(cdnBase.length + 1));
  }

  const base = (baseUrl || getAppBaseUrl()).replace(/\/$/, "");
  const prefix = `${base}/api/storage/`;
  if (!publicUrl.startsWith(prefix)) return null;

  return decodeStorageKeyFromUrl(publicUrl.slice(prefix.length));
}

export function isStoragePublicUrl(url: string, baseUrl?: string): boolean {
  const cdnBase = getStorageCdnBaseUrl();
  if (cdnBase && url.startsWith(`${cdnBase}/`)) return true;

  const base = (baseUrl || getAppBaseUrl()).replace(/\/$/, "");
  return url.startsWith(`${base}/api/storage/`);
}

async function ensureLocalDir(subdir: string): Promise<string> {
  const dir = path.join(LOCAL_STORAGE_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function uploadLocal(
  storageKey: string,
  buffer: Buffer,
  _mimeType: string,
  baseUrl?: string
): Promise<StorageResult> {
  const dir = await ensureLocalDir(path.dirname(storageKey));
  await fs.writeFile(path.join(dir, path.basename(storageKey)), buffer);
  return { storageKey, publicUrl: getStoragePublicUrl(storageKey, baseUrl) };
}

function userTrainingPhotoKey(userId: string, fileName: string): string {
  const ext = path.extname(fileName) || ".jpg";
  return `users/${userId}/training/${uuidv4()}${ext}`;
}

export async function uploadUserPhoto(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string,
  baseUrl?: string
): Promise<StorageResult> {
  const storageKey = userTrainingPhotoKey(userId, fileName);

  if (useB2()) {
    await uploadToB2Storage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey, baseUrl) };
  }

  if (useFirebase()) {
    await uploadToFirebaseStorage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey, baseUrl) };
  }

  return uploadLocal(storageKey, buffer, mimeType, baseUrl);
}

export async function uploadAtPath(
  storageKey: string,
  buffer: Buffer,
  mimeType: string,
  baseUrl?: string
): Promise<StorageResult> {
  if (useB2()) {
    await uploadToB2Storage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey, baseUrl) };
  }

  if (useFirebase()) {
    await uploadToFirebaseStorage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey, baseUrl) };
  }

  return uploadLocal(storageKey, buffer, mimeType, baseUrl);
}

export async function downloadFromStorage(storageKey: string): Promise<Buffer> {
  if (useB2()) {
    return downloadFromB2Storage(storageKey);
  }

  if (useFirebase()) {
    return downloadFromFirebaseStorage(storageKey);
  }

  const filePath = path.join(LOCAL_STORAGE_DIR, storageKey);
  return fs.readFile(filePath);
}

export async function listStoragePrefix(prefix: string): Promise<string[]> {
  if (useB2()) {
    return listB2StoragePrefix(prefix);
  }

  if (useFirebase()) {
    return listFirebaseStoragePrefix(prefix);
  }

  const dir = path.join(LOCAL_STORAGE_DIR, prefix);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => `${prefix}${e.name}`);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    return [];
  }
}

export async function storageObjectExists(storageKey: string): Promise<boolean> {
  if (useB2()) {
    return existsInB2Storage(storageKey);
  }

  if (useFirebase()) {
    return existsInFirebaseStorage(storageKey);
  }

  try {
    await fs.access(path.join(LOCAL_STORAGE_DIR, storageKey));
    return true;
  } catch {
    return false;
  }
}

export async function deleteFromStorage(storageKey: string): Promise<void> {
  if (useB2()) {
    await deleteFromB2Storage(storageKey);
    return;
  }

  if (useFirebase()) {
    const { deleteFromFirebaseStorage } = await import("@/lib/firebase/storage");
    await deleteFromFirebaseStorage(storageKey);
    return;
  }

  try {
    await fs.unlink(path.join(LOCAL_STORAGE_DIR, storageKey));
  } catch {
    // ignore missing local files
  }
}

export async function uploadProcessedImage(
  userId: string,
  buffer: Buffer,
  prefix: string
): Promise<StorageResult> {
  const storageKey = `users/${userId}/generations/${prefix}-${uuidv4()}.png`;
  return uploadAtPath(storageKey, buffer, "image/png");
}

export function usesCloudStorage(): boolean {
  return useB2() || isFirebaseStorageConfigured();
}

/** @deprecated Prefer usesCloudStorage */
export function usesFirebaseStorage(): boolean {
  return useFirebase();
}

export function getActiveStorageProvider(): "b2" | "firebase" | "local" {
  if (useB2()) return "b2";
  if (useFirebase()) return "firebase";
  return "local";
}

/** URL for external services (Higgsfield, FAL) to download a user file. */
export async function getExternalFetchUrl(
  storageKey: string,
  baseUrl?: string
): Promise<string> {
  if (useB2()) {
    return getB2PresignedReadUrl(storageKey);
  }

  if (useFirebase()) {
    const { getFirebaseSignedReadUrl } = await import("@/lib/firebase/storage");
    return getFirebaseSignedReadUrl(storageKey);
  }

  return getStoragePublicUrl(storageKey, baseUrl);
}

/** Resolve a stored image to a data URI FAL can always consume. */
export async function getFalImageUrl(
  storageKey: string,
  _baseUrl?: string,
  mimeType = "image/png"
): Promise<string> {
  const buffer = await downloadFromStorage(storageKey);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function inferMimeType(storageKey: string, fallback = "image/png"): string {
  const ext = storageKey.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "png") return "image/png";
  return fallback;
}

/** Resolve a public app URL, storage key, or external URL for FAL image editing. */
export async function resolveFalImageUrl(
  publicUrl: string,
  baseUrl?: string,
  mimeType = "image/png"
): Promise<string> {
  if (publicUrl.startsWith("data:")) return publicUrl;

  const storageKey = getStorageKeyFromPublicUrl(publicUrl, baseUrl);
  if (storageKey) {
    return getFalImageUrl(storageKey, baseUrl, inferMimeType(storageKey, mimeType));
  }

  const { fetchImageBuffer } = await import("@/lib/watermark");
  const buffer = await fetchImageBuffer(publicUrl);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export function bufferToDataUri(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
