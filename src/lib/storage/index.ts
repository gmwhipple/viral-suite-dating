import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");

export interface StorageResult {
  storageKey: string;
  publicUrl: string;
}

async function ensureLocalDir(subdir: string): Promise<string> {
  const dir = path.join(LOCAL_STORAGE_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function uploadLocal(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<StorageResult> {
  const ext = path.extname(fileName) || ".jpg";
  const objectName = `${userId}/${uuidv4()}${ext}`;
  const dir = await ensureLocalDir(path.dirname(objectName));
  const filePath = path.join(dir, path.basename(objectName));
  await fs.writeFile(filePath, buffer);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    storageKey: objectName,
    publicUrl: `${baseUrl}/api/storage/${objectName}`,
  };
}

async function uploadReplit(
  userId: string,
  fileName: string,
  buffer: Buffer
): Promise<StorageResult> {
  const { Client } = await import("@replit/object-storage");
  const client = new Client();
  const ext = path.extname(fileName) || ".jpg";
  const objectName = `private/${userId}/${uuidv4()}${ext}`;

  const { ok, error } = await client.uploadFromBytes(objectName, buffer);
  if (!ok) {
    throw new Error(`Replit storage upload failed: ${error?.message || "unknown"}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  return {
    storageKey: objectName,
    publicUrl: `${baseUrl}/api/storage/${encodeURIComponent(objectName)}`,
  };
}

export async function uploadUserPhoto(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<StorageResult> {
  if (process.env.REPL_ID) {
    return uploadReplit(userId, fileName, buffer);
  }
  return uploadLocal(userId, fileName, buffer, mimeType);
}

export async function downloadFromStorage(storageKey: string): Promise<Buffer> {
  if (process.env.REPL_ID) {
    const { Client } = await import("@replit/object-storage");
    const client = new Client();
    const { ok, value, error } = await client.downloadAsBytes(storageKey);
    if (!ok || !value) {
      throw new Error(`Replit download failed: ${error?.message || "unknown"}`);
    }
    const [buffer] = value;
    return buffer;
  }

  const filePath = path.join(LOCAL_STORAGE_DIR, storageKey);
  return fs.readFile(filePath);
}

export async function uploadProcessedImage(
  userId: string,
  buffer: Buffer,
  prefix: string
): Promise<StorageResult> {
  const fileName = `${prefix}-${uuidv4()}.png`;
  return uploadUserPhoto(userId, fileName, buffer, "image/png");
}

export function isReplitEnvironment(): boolean {
  return Boolean(process.env.REPL_ID);
}
