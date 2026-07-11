import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getOrCreateUser } from "@/lib/services/users";
import {
  ensureCharactersForUser,
  getCharacter,
  listUserCharacters,
  setActiveCharacter,
} from "@/lib/services/characters";
import { countUserPhotos } from "@/lib/services/users";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
  const photoCount = await countUserPhotos(auth.uid);
  const characters = await ensureCharactersForUser(user, photoCount);

  return NextResponse.json({
    characters,
    activeCharacterId: user.activeCharacterId || characters[0]?.id || null,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { characterId?: string };
  const characterId = body?.characterId;
  if (typeof characterId !== "string" || !characterId) {
    return NextResponse.json({ error: "characterId required" }, { status: 400 });
  }

  const character = await getCharacter(auth.uid, characterId);
  if (!character) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  await setActiveCharacter(auth.uid, characterId);
  return NextResponse.json({ character, activeCharacterId: characterId });
}
