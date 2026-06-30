import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getOrCreateUser, getUserPhotos, getUserGenerations } from "@/lib/services/users";
import { getUserActivity } from "@/lib/activity-log";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import type { EditJob } from "@/lib/firebase/types";
import styleReferences from "@/data/style-references.json";
import { MAX_UPLOAD_PHOTOS, MAX_GENERATIONS_PER_USER } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(auth.uid, auth.email);
  const photos = await getUserPhotos(auth.uid);
  const generations = await getUserGenerations(auth.uid);
  const activity = await getUserActivity(auth.uid, 30);

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
    activity,
    styleReferences,
    limits: {
      maxPhotos: MAX_UPLOAD_PHOTOS,
      maxGenerations: MAX_GENERATIONS_PER_USER,
      generationsRemaining: Math.max(0, user.generationsLimit - user.generationsUsed),
    },
  });
}
