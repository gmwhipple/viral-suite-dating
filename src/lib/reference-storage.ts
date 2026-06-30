import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ImageReference, ReferenceGender } from "@/lib/firebase/types";
import { downloadFromStorage, isReplitEnvironment } from "@/lib/storage";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export const CATALOG_PREFIX: Record<ReferenceGender, string> = {
  men: "references/men/",
  women: "references/women/",
};

export function getStoragePublicUrl(storageKey: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/api/storage/${storageKey}`;
}

function isImageFile(name: string): boolean {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function displayNameFromKey(storageKey: string): string {
  const base = path.basename(storageKey, path.extname(storageKey));
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function toImageReference(
  storageKey: string,
  gender: ImageReference["gender"],
  source: ImageReference["source"]
): ImageReference {
  return {
    id: `${source}:${gender}:${storageKey}`,
    name: displayNameFromKey(storageKey),
    storageKey,
    publicUrl: getStoragePublicUrl(storageKey),
    gender,
    source,
  };
}

async function listLocalPrefix(prefix: string): Promise<string[]> {
  const dir = path.join(LOCAL_STORAGE_DIR, prefix);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && isImageFile(e.name))
      .map((e) => `${prefix}${e.name}`);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    return [];
  }
}

async function listReplitPrefix(prefix: string): Promise<string[]> {
  const { Client } = await import("@replit/object-storage");
  const client = new Client();
  const { ok, value, error } = await client.list({ prefix, maxResults: 500 });
  if (!ok || !value) {
    console.log("[reference-storage] list failed", prefix, error?.message);
    return [];
  }
  return value.map((obj) => obj.name).filter(isImageFile);
}

export async function listCatalogReferences(gender: ReferenceGender): Promise<ImageReference[]> {
  const prefix = CATALOG_PREFIX[gender];
  const keys = isReplitEnvironment()
    ? await listReplitPrefix(prefix)
    : await listLocalPrefix(prefix);

  return keys
    .sort((a, b) => a.localeCompare(b))
    .map((storageKey) => toImageReference(storageKey, gender, "catalog"));
}

export async function listCustomReferences(userId: string): Promise<ImageReference[]> {
  const prefix = `private/${userId}/style-refs/`;
  const keys = isReplitEnvironment()
    ? await listReplitPrefix(prefix)
    : await listLocalPrefix(prefix);

  return keys
    .sort((a, b) => b.localeCompare(a))
    .map((storageKey) =>
      toImageReference(storageKey, "custom", "custom")
    );
}

export async function uploadCustomReference(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<ImageReference> {
  const ext = path.extname(fileName) || ".jpg";
  const storageKey = `private/${userId}/style-refs/${uuidv4()}${ext}`;

  if (isReplitEnvironment()) {
    const { Client } = await import("@replit/object-storage");
    const client = new Client();
    const { ok, error } = await client.uploadFromBytes(storageKey, buffer);
    if (!ok) {
      throw new Error(`Upload failed: ${error?.message || "unknown"}`);
    }
  } else {
    const dir = path.join(LOCAL_STORAGE_DIR, path.dirname(storageKey));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(LOCAL_STORAGE_DIR, storageKey), buffer);
  }

  console.log("[reference-storage] custom reference uploaded", {
    userId,
    storageKey,
    mimeType,
  });

  return toImageReference(storageKey, "custom", "custom");
}

export async function resolveImageReference(
  userId: string,
  storageKey: string
): Promise<ImageReference | null> {
  const isCatalog = storageKey.startsWith(CATALOG_PREFIX.men) || storageKey.startsWith(CATALOG_PREFIX.women);
  const isOwnCustom =
    storageKey.startsWith(`private/${userId}/style-refs/`);

  if (!isCatalog && !isOwnCustom) {
    return null;
  }

  try {
    await downloadFromStorage(storageKey);
  } catch {
    return null;
  }

  let gender: ImageReference["gender"] = "custom";
  if (storageKey.startsWith(CATALOG_PREFIX.men)) gender = "men";
  if (storageKey.startsWith(CATALOG_PREFIX.women)) gender = "women";

  return toImageReference(storageKey, gender, isCatalog ? "catalog" : "custom");
}

export async function ensureCatalogFolders(): Promise<void> {
  if (isReplitEnvironment()) return;
  await fs.mkdir(path.join(LOCAL_STORAGE_DIR, CATALOG_PREFIX.men), { recursive: true });
  await fs.mkdir(path.join(LOCAL_STORAGE_DIR, CATALOG_PREFIX.women), { recursive: true });
}
