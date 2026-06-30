import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getOrCreateUser, getUserPhotos, getUserGenerations } from "@/lib/services/users";
import { getUserActivity } from "@/lib/activity-log";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { listCatalogReferences, listCustomReferences } from "@/lib/reference-storage";
import type { EditJob, ReferenceGender } from "@/lib/firebase/types";
import { MAX_UPLOAD_PHOTOS, MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
  const photos = await getUserPhotos(auth.uid);
  const generations = await getUserGenerations(auth.uid);
  const recentActivity = await getUserActivity(auth.uid, 30);
  const gender: ReferenceGender = user.referenceGender === "women" ? "women" : "men";

  const [catalogReferences, customReferences] = await Promise.all([
    listCatalogReferences(gender),
    listCustomReferences(auth.uid),
  ]);

  let edits: EditJob[] = [];
  if (isAdminConfigured()) {
    const snap = await getAdminDb()
      .collection(COLLECTIONS.edits)
      .where("userId", "==", auth.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    edits = snap.docs.map((d) => d.data() as EditJob);
  }

  return NextResponse.json({
    user,
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
}
