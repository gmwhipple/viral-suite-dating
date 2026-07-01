import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getOrCreateUser, getUserPhotos, getUserGenerations, countUserPhotos } from "@/lib/services/users";
import { ensureCharactersForUser } from "@/lib/services/characters";
import { getUserActivity } from "@/lib/activity-log";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { listCatalogReferences, listCustomReferences } from "@/lib/reference-storage";
import type { EditJob, ReferenceGender } from "@/lib/firebase/types";
import { MAX_UPLOAD_PHOTOS, MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";
import { getStoragePublicUrl } from "@/lib/storage";

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
    const photoCount = await countUserPhotos(auth.uid);
    const characters = await ensureCharactersForUser(user, photoCount);
    const recentActivity = await getUserActivity(auth.uid, 30);
    const gender: ReferenceGender = user.referenceGender === "women" ? "women" : "men";

    const [catalogReferences, customReferences] = await Promise.all([
      listCatalogReferences(gender, baseUrl),
      listCustomReferences(auth.uid, baseUrl),
    ]);

    let edits: EditJob[] = [];
    if (isAdminConfigured()) {
      const snap = await getAdminDb()
        .collection(COLLECTIONS.edits)
        .where("userId", "==", auth.uid)
        .get();
      edits = snap.docs
        .map((d) => d.data() as EditJob)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
    }

    return NextResponse.json({
      user,
      characters,
      photos,
      generations,
      edits,
      recentActivity,
      catalogReferences,
      customReferences,
      limits: {
        maxPhotos: MAX_UPLOAD_PHOTOS,
        maxGenerations: TESTING_BYPASS_PAYMENT
          ? MAX_GENERATIONS_PER_USER
          : user.generationsLimit,
        generationsRemaining: TESTING_BYPASS_PAYMENT
          ? Math.max(0, MAX_GENERATIONS_PER_USER - user.generationsUsed)
          : Math.max(0, user.generationsLimit - user.generationsUsed),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dashboard load failed";
    console.log("[dashboard] error", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
