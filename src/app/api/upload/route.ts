import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { uploadUserPhoto, deleteFromStorage } from "@/lib/storage";
import {
  saveUserPhoto,
  getOrCreateUser,
  deleteUserPhoto,
  countUserPhotos,
  updateUser,
} from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { v4 as uuidv4 } from "uuid";
import { MAX_UPLOAD_PHOTOS } from "@/lib/constants";

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await uploadUserPhoto(auth.uid, file.name, buffer, file.type);

    const photo = {
      id: uuidv4(),
      userId: auth.uid,
      storageKey: stored.storageKey,
      publicUrl: stored.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    };

    await saveUserPhoto(photo);

    await logActivity(auth.uid, "photo_uploaded", {
      photoId: photo.id,
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
    const photoId = request.nextUrl.searchParams.get("photoId");
    if (!photoId) {
      return NextResponse.json({ error: "photoId required" }, { status: 400 });
    }

    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    if (["training", "pending_training"].includes(user.soulJobStatus)) {
      return NextResponse.json(
        { error: "Cannot remove photos while training is in progress" },
        { status: 409 }
      );
    }

    const photo = await deleteUserPhoto(auth.uid, photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await deleteFromStorage(photo.storageKey);

    const remaining = await countUserPhotos(auth.uid);
    if (remaining === 0 && user.soulJobStatus === "failed") {
      await updateUser(auth.uid, {
        soulJobStatus: "draft",
        higgsfieldRequestId: undefined,
        soulReferenceId: undefined,
      });
    }

    await logActivity(auth.uid, "photo_deleted", { photoId, fileName: photo.fileName }, {
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

  const { getUserPhotos } = await import("@/lib/services/users");
  const photos = await getUserPhotos(auth.uid);

  return NextResponse.json({
    photos,
    limit: MAX_UPLOAD_PHOTOS,
    count: photos.length,
  });
}
