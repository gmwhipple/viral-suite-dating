import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getOrCreateUser, getUserPhotos, getUserGenerations } from "@/lib/services/users";
import { ensureCharactersForUser } from "@/lib/services/characters";
import type { UserCharacter } from "@/lib/firebase/types";
import { MAX_UPLOAD_PHOTOS, MAX_GENERATIONS_PER_USER, MAX_EDITS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { getStoragePublicUrl } from "@/lib/storage";
import { sanitizeDashboardPayload } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";

function enrichCharacters(
  characters: UserCharacter[],
  photos: { storageKey: string; publicUrl: string; uploadedAt: string }[],
  baseUrl: string
) {
  const oldestPhoto = [...photos].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt))[0];

  return characters.map((character) => ({
    ...character,
    thumbnailUrl: character.thumbnailStorageKey
      ? getStoragePublicUrl(character.thumbnailStorageKey, baseUrl)
      : oldestPhoto?.publicUrl,
  }));
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    const baseUrl = getAppBaseUrl(request);
    const photos = (await getUserPhotos(auth.uid)).map((photo) => ({
      ...photo,
      publicUrl: getStoragePublicUrl(photo.storageKey, baseUrl),
    }));
    const generations = await getUserGenerations(auth.uid);
    const characters = enrichCharacters(
      await ensureCharactersForUser(user, photos.length),
      photos,
      baseUrl
    );

    return NextResponse.json(
      sanitizeDashboardPayload({
        user,
        characters,
        photos,
        generations,
        limits: {
          maxPhotos: MAX_UPLOAD_PHOTOS,
          maxGenerations: TESTING_BYPASS_PAYMENT
            ? MAX_GENERATIONS_PER_USER
            : user.generationsLimit,
          generationsRemaining: TESTING_BYPASS_PAYMENT
            ? Math.max(0, MAX_GENERATIONS_PER_USER - (user.generationsUsed || 0))
            : Math.max(0, user.generationsLimit - user.generationsUsed),
          maxEdits: TESTING_BYPASS_PAYMENT
            ? MAX_EDITS_PER_USER
            : Math.min(user.editsLimit || 0, MAX_EDITS_PER_USER),
          editsRemaining: TESTING_BYPASS_PAYMENT
            ? Math.max(0, MAX_EDITS_PER_USER - (user.editsUsed || 0))
            : Math.max(
                0,
                Math.min(user.editsLimit || 0, MAX_EDITS_PER_USER) - (user.editsUsed || 0)
              ),
        },
      })
    );
  } catch (err) {
    const message = toPublicErrorMessage(err, "Dashboard load failed");
    console.log("[dashboard] error", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
