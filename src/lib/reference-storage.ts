import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ImageReference, ReferenceGender, UserProfile } from "@/lib/firebase/types";
import { FREE_CATALOG_REFERENCE_LIMIT } from "@/lib/constants";
import { userHasCatalogAccess } from "@/lib/plan-access";
import {
  downloadFromStorage,
  getStoragePublicUrl,
  listStoragePrefix,
  storageObjectExists,
  uploadAtPath,
} from "@/lib/storage";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export const CATALOG_PREFIX: Record<ReferenceGender, string> = {
  men: "references/men/",
  women: "references/women/",
};

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
  source: ImageReference["source"],
  baseUrl?: string
): ImageReference {
  return {
    id: `${source}:${gender}:${storageKey}`,
    name: displayNameFromKey(storageKey),
    storageKey,
    publicUrl: getStoragePublicUrl(storageKey, baseUrl),
    gender,
    source,
  };
}

export async function listCatalogReferences(
  gender: ReferenceGender,
  baseUrl?: string
): Promise<ImageReference[]> {
  const prefix = CATALOG_PREFIX[gender];
  const keys = (await listStoragePrefix(prefix)).filter(isImageFile);

  return keys
    .sort((a, b) => a.localeCompare(b))
    .map((storageKey) => toImageReference(storageKey, gender, "catalog", baseUrl));
}

export async function listCatalogReferencesForPlan(
  gender: ReferenceGender,
  plan: UserProfile["plan"],
  baseUrl?: string
): Promise<{
  catalogReferences: ImageReference[];
  catalogTotal: number;
  catalogLockedCount: number;
}> {
  const all = await listCatalogReferences(gender, baseUrl);

  if (userHasCatalogAccess(plan)) {
    return {
      catalogReferences: all,
      catalogTotal: all.length,
      catalogLockedCount: 0,
    };
  }

  const visible = all.slice(0, FREE_CATALOG_REFERENCE_LIMIT);
  return {
    catalogReferences: visible,
    catalogTotal: all.length,
    catalogLockedCount: Math.max(0, all.length - visible.length),
  };
}

function catalogGenderFromKey(storageKey: string): ReferenceGender | null {
  if (storageKey.startsWith(CATALOG_PREFIX.men)) return "men";
  if (storageKey.startsWith(CATALOG_PREFIX.women)) return "women";
  return null;
}

export async function isCatalogReferenceAllowedForUser(
  storageKey: string,
  plan: UserProfile["plan"]
): Promise<boolean> {
  if (userHasCatalogAccess(plan)) return true;

  const gender = catalogGenderFromKey(storageKey);
  if (!gender) return true;

  const all = await listCatalogReferences(gender);
  const allowedKeys = new Set(
    all.slice(0, FREE_CATALOG_REFERENCE_LIMIT).map((ref) => ref.storageKey)
  );
  return allowedKeys.has(storageKey);
}

export async function listCustomReferences(
  userId: string,
  baseUrl?: string
): Promise<ImageReference[]> {
  const prefix = `users/${userId}/style-refs/`;
  const keys = (await listStoragePrefix(prefix)).filter(isImageFile);

  return keys
    .sort((a, b) => b.localeCompare(a))
    .map((storageKey) => toImageReference(storageKey, "custom", "custom", baseUrl));
}

export async function uploadCustomReference(
  userId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string,
  baseUrl?: string
): Promise<ImageReference> {
  const ext = path.extname(fileName) || ".jpg";
  const storageKey = `users/${userId}/style-refs/${uuidv4()}${ext}`;

  await uploadAtPath(storageKey, buffer, mimeType, baseUrl);

  console.log("[reference-storage] custom reference uploaded", {
    userId,
    storageKey,
    mimeType,
  });

  return toImageReference(storageKey, "custom", "custom", baseUrl);
}

export async function resolveImageReference(
  userId: string,
  storageKey: string,
  baseUrl?: string
): Promise<ImageReference | null> {
  const isCatalog =
    storageKey.startsWith(CATALOG_PREFIX.men) || storageKey.startsWith(CATALOG_PREFIX.women);
  const isOwnCustom = storageKey.startsWith(`users/${userId}/style-refs/`);

  if (!isCatalog && !isOwnCustom) {
    return null;
  }

  const exists = await storageObjectExists(storageKey);
  if (!exists) {
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

  return toImageReference(storageKey, gender, isCatalog ? "catalog" : "custom", baseUrl);
}

export { getStoragePublicUrl };
