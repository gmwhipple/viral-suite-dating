import { v4 as uuidv4 } from "uuid";
import { getAdminDb, COLLECTIONS, isAdminConfigured, omitUndefined } from "@/lib/firebase/admin";
import type { SoulJobStatus, UserCharacter, UserProfile } from "@/lib/firebase/types";
import { updateUser } from "@/lib/services/users";

export async function listUserCharacters(userId: string): Promise<UserCharacter[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.characters)
    .where("userId", "==", userId)
    .get();

  return snap.docs
    .map((d) => d.data() as UserCharacter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCharacter(
  userId: string,
  characterId: string
): Promise<UserCharacter | null> {
  if (!isAdminConfigured()) return null;

  const snap = await getAdminDb().collection(COLLECTIONS.characters).doc(characterId).get();
  if (!snap.exists) return null;

  const character = snap.data() as UserCharacter;
  if (character.userId !== userId) return null;
  return character;
}

export async function createCharacter(
  data: Omit<UserCharacter, "createdAt" | "updatedAt" | "id"> & { id?: string }
): Promise<UserCharacter> {
  const now = new Date().toISOString();
  const character: UserCharacter = {
    id: data.id || uuidv4(),
    userId: data.userId,
    label: data.label,
    status: data.status,
    photoCount: data.photoCount,
    soulReferenceId: data.soulReferenceId,
    higgsfieldRequestId: data.higgsfieldRequestId,
    lastTrainingError: data.lastTrainingError,
    createdAt: now,
    updatedAt: now,
  };

  if (isAdminConfigured()) {
    await getAdminDb().collection(COLLECTIONS.characters).doc(character.id).set(omitUndefined(character));
  }

  return character;
}

export async function updateCharacter(
  characterId: string,
  data: Partial<UserCharacter>
): Promise<void> {
  if (!isAdminConfigured()) return;
  await getAdminDb()
    .collection(COLLECTIONS.characters)
    .doc(characterId)
    .update(omitUndefined({ ...data, updatedAt: new Date().toISOString() }));
}

export async function setActiveCharacter(userId: string, characterId: string): Promise<UserCharacter | null> {
  const character = await getCharacter(userId, characterId);
  if (!character) return null;

  await updateUser(userId, { activeCharacterId: characterId });
  return character;
}

function characterLabelFromDate(iso: string): string {
  try {
    return `Character · ${new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  } catch {
    return "Character";
  }
}

/** Backfill a character row from legacy single-character user fields. */
export async function ensureCharactersForUser(
  user: UserProfile,
  fallbackPhotoCount = 0
): Promise<UserCharacter[]> {
  const existing = await listUserCharacters(user.uid);
  if (existing.length > 0) {
    if (!user.activeCharacterId && existing[0]) {
      await updateUser(user.uid, { activeCharacterId: existing[0].id });
    }
    return existing;
  }

  const hasLegacyState =
    user.soulReferenceId ||
    user.higgsfieldRequestId ||
    !["draft", "uploading"].includes(user.soulJobStatus);

  if (!hasLegacyState) return [];

  const status = user.soulJobStatus as UserCharacter["status"];
  const character = await createCharacter({
    userId: user.uid,
    label: characterLabelFromDate(user.updatedAt || user.createdAt),
    status,
    photoCount: fallbackPhotoCount,
    soulReferenceId: user.soulReferenceId,
    higgsfieldRequestId: user.higgsfieldRequestId,
    lastTrainingError: user.lastTrainingError,
  });

  await updateUser(user.uid, { activeCharacterId: character.id });
  return [character];
}

export async function syncTrainingCharacter(
  user: UserProfile,
  updates: Partial<UserCharacter>
): Promise<void> {
  const characters = await listUserCharacters(user.uid);
  const activeId = user.activeCharacterId;
  const target =
    characters.find((c) => c.id === activeId) ||
    characters.find((c) => c.status === "training" || c.status === "pending_training") ||
    characters[0];

  if (!target) return;
  await updateCharacter(target.id, updates);
}

export function isCharacterReady(character: UserCharacter): boolean {
  return character.status === "ready" && Boolean(character.soulReferenceId);
}

export function isCharacterTraining(character: UserCharacter): boolean {
  return character.status === "training" || character.status === "pending_training";
}

export { characterLabelFromDate };
