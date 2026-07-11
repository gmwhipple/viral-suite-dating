import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { uploadUserPhoto } from "@/lib/storage";
import {
  assertCanUploadTrainingPhoto,
  getOrCreateUser,
  deleteUserPhotoByStorageKey,
  purgeExpiredTrainingPhotos,
  countUserPhotos,
  updateUser,
  trainingPhotoRetentionExpiresAt,
  trainingPhotoId,
  getUserPhotos,
} from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { invalidateUserMediaCache } from "@/lib/dashboard-cache";
import { MAX_UPLOAD_PHOTOS } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    if (["training", "pending_training"].includes(user.soulJobStatus)) {
      return NextResponse.json(
        { error: "Cannot upload photos while training is in progress" },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Max file size 15MB" }, { status: 400 });
    }

    await assertCanUploadTrainingPhoto(auth.uid);

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseUrl = getAppBaseUrl(request);
    const stored = await uploadUserPhoto(auth.uid, file.name, buffer, file.type, baseUrl);

    const uploadedAt = new Date().toISOString();
    const photo = {
      id: trainingPhotoId(stored.storageKey),
      userId: auth.uid,
      storageKey: stored.storageKey,
      publicUrl: stored.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt,
      retentionExpiresAt: trainingPhotoRetentionExpiresAt(uploadedAt),
    };

    await purgeExpiredTrainingPhotos(auth.uid);
    invalidateUserMediaCache(auth.uid);

    await logActivity(auth.uid, "photo_uploaded", {
      storageKey: photo.storageKey,
      fileName: file.name,
      fileSize: file.size,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.log("[upload] error", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const storageKey =
      request.nextUrl.searchParams.get("storageKey") ||
      request.nextUrl.searchParams.get("photoId");
    if (!storageKey) {
      return NextResponse.json({ error: "storageKey required" }, { status: 400 });
    }

    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    if (["training", "pending_training"].includes(user.soulJobStatus)) {
      return NextResponse.json(
        { error: "Cannot remove photos while training is in progress" },
        { status: 409 }
      );
    }

    const photo = await deleteUserPhotoByStorageKey(auth.uid, storageKey);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    invalidateUserMediaCache(auth.uid);

    const remaining = await countUserPhotos(auth.uid);
    if (remaining === 0 && user.soulJobStatus === "failed") {
      await updateUser(auth.uid, {
        soulJobStatus: "draft",
        higgsfieldRequestId: undefined,
        soulReferenceId: undefined,
      });
    }

    await logActivity(auth.uid, "photo_deleted", {
      storageKey,
      fileName: photo.fileName,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ ok: true, remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    console.log("[upload] delete error", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = getAppBaseUrl(request);
  const photos = await getUserPhotos(auth.uid, baseUrl);

  return NextResponse.json({
    photos,
    limit: MAX_UPLOAD_PHOTOS,
    count: photos.length,
  });
}
