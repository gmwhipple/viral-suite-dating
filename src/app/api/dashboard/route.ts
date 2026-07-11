import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import {
  getOrCreateUser,
  getPollablePendingGenerations,
} from "@/lib/services/users";
import { ensureCharactersForUser } from "@/lib/services/characters";
import type { UserCharacter } from "@/lib/firebase/types";
import {
  MAX_UPLOAD_PHOTOS,
  MAX_GENERATIONS_PER_USER,
  MAX_EDITS_PER_USER,
  TESTING_BYPASS_PAYMENT,
  DASHBOARD_GALLERY_LIMIT,
  DASHBOARD_MEDIA_CACHE_MS,
  PENDING_PURCHASE_CLAIM_COOLDOWN_MS,
  DASHBOARD_RATE_LIMIT_PER_USER,
  DASHBOARD_RATE_LIMIT_PER_IP,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { getStoragePublicUrl } from "@/lib/storage";
import { sanitizeDashboardPayload } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  getCachedUserMedia,
  shouldClaimPendingPurchase,
} from "@/lib/dashboard-cache";

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
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(
    `dashboard:ip:${ip}`,
    DASHBOARD_RATE_LIMIT_PER_IP,
    RATE_LIMIT_WINDOW_MS
  );
  if (!ipLimit.allowed) {
    return rateLimitResponse(ipLimit.retryAfterSec);
  }

  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userLimit = checkRateLimit(
    `dashboard:uid:${auth.uid}`,
    DASHBOARD_RATE_LIMIT_PER_USER,
    RATE_LIMIT_WINDOW_MS
  );
  if (!userLimit.allowed) {
    return rateLimitResponse(userLimit.retryAfterSec);
  }

  try {
    const claimPurchase = shouldClaimPendingPurchase(
      auth.uid,
      PENDING_PURCHASE_CLAIM_COOLDOWN_MS
    );
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName, {
      claimPendingPurchase: claimPurchase,
    });
    const baseUrl = getAppBaseUrl(request);

    const [{ photos, completedGenerations }, pendingGenerations] = await Promise.all([
      getCachedUserMedia(auth.uid, baseUrl, DASHBOARD_MEDIA_CACHE_MS, DASHBOARD_GALLERY_LIMIT),
      getPollablePendingGenerations(auth.uid),
    ]);

    const generations = [...pendingGenerations, ...completedGenerations]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, DASHBOARD_GALLERY_LIMIT);

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
      }),
      {
        headers: {
          "Cache-Control": "private, max-age=30",
        },
      }
    );
  } catch (err) {
    const message = toPublicErrorMessage(err, "Dashboard load failed");
    console.log("[dashboard] error", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
