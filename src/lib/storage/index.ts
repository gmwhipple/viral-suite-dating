import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  downloadFromFirebaseStorage,
  isFirebaseStorageConfigured,
  listFirebaseStoragePrefix,
  uploadToFirebaseStorage,
  existsInFirebaseStorage,
} from "@/lib/firebase/storage";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");

export interface StorageResult {
  storageKey: string;
  publicUrl: string;
}

export function getStoragePublicUrl(storageKey: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const encoded = storageKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/api/storage/${encoded}`;
}

async function ensureLocalDir(subdir: string): Promise<string> {
  const dir = path.join(LOCAL_STORAGE_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function uploadLocal(
  storageKey: string,
  buffer: Buffer,
  _mimeType: string
): Promise<StorageResult> {
  const dir = await ensureLocalDir(path.dirname(storageKey));
  await fs.writeFile(path.join(dir, path.basename(storageKey)), buffer);
  return { storageKey, publicUrl: getStoragePublicUrl(storageKey) };
}

function userPhotoKey(userId: string, fileName: string): string {
  const ext = path.extname(fileName) || ".jpg";
  return `users/${userId}/photos/${uuidv4()}${ext}`;
}

export async function uploadUserPhoto(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<StorageResult> {
  const storageKey = userPhotoKey(userId, fileName);

  if (isFirebaseStorageConfigured()) {
    await uploadToFirebaseStorage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey) };
  }

  return uploadLocal(storageKey, buffer, mimeType);
}

export async function uploadAtPath(
  storageKey: string,
  buffer: Buffer,
  mimeType: string
): Promise<StorageResult> {
  if (isFirebaseStorageConfigured()) {
    await uploadToFirebaseStorage(storageKey, buffer, mimeType);
    return { storageKey, publicUrl: getStoragePublicUrl(storageKey) };
  }

  return uploadLocal(storageKey, buffer, mimeType);
}

export async function downloadFromStorage(storageKey: string): Promise<Buffer> {
  if (isFirebaseStorageConfigured()) {
    return downloadFromFirebaseStorage(storageKey);
  }

  const filePath = path.join(LOCAL_STORAGE_DIR, storageKey);
  return fs.readFile(filePath);
}

export async function listStoragePrefix(prefix: string): Promise<string[]> {
  if (isFirebaseStorageConfigured()) {
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
  if (isFirebaseStorageConfigured()) {
    return existsInFirebaseStorage(storageKey);
  }

  try {
    await fs.access(path.join(LOCAL_STORAGE_DIR, storageKey));
    return true;
  } catch {
    return false;
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

export function usesFirebaseStorage(): boolean {
  return isFirebaseStorageConfigured();
}
