import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { getOrCreateUser, updateUser, getUserPhotos } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { createSoulCharacter, isHiggsfieldConfigured } from "@/lib/higgsfield";
import { MIN_SOUL_TRAINING_PHOTOS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "Higgsfield not configured" }, { status: 503 });
  }

  try {
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    const photos = await getUserPhotos(auth.uid);

    if (photos.length < MIN_SOUL_TRAINING_PHOTOS) {
      return NextResponse.json({
        error: `Upload at least ${MIN_SOUL_TRAINING_PHOTOS} photos to train your character`,
      }, { status: 400 });
    }

    if (user.soulJobStatus === "training" || user.soulJobStatus === "pending_training") {
      return NextResponse.json({ error: "Training already in progress" }, { status: 409 });
    }

    await updateUser(auth.uid, {
      soulJobStatus: "pending_training",
    });

    const imageUrls = photos.map((p) => p.publicUrl);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    const soulId = await createSoulCharacter({
      name: `user-${auth.uid.slice(0, 8)}`,
      imageUrls,
    });

    await updateUser(auth.uid, {
      soulJobStatus: "training",
      higgsfieldRequestId: soulId.id,
    });

    await logActivity(auth.uid, "soul_training_started", {
      soulId: soulId.id,
      photoCount: photos.length,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      status: "training",
      soulId: soulId.id,
      message: "Your AI character is being trained. We'll notify you when ready.",
    });
  } catch (err) {
    await updateUser(auth.uid, { soulJobStatus: "failed" });
    const message = err instanceof Error ? err.message : "Training failed";
    console.log("[soul/train] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);

  if (user.higgsfieldRequestId && user.soulJobStatus === "training") {
    const { pollSoulIdStatus } = await import("@/lib/higgsfield");
    const status = await pollSoulIdStatus(user.higgsfieldRequestId);

    if (status?.status === "completed") {
      await updateUser(auth.uid, {
        soulJobStatus: "ready",
        soulReferenceId: status.id,
      });
      user.soulJobStatus = "ready";
      user.soulReferenceId = status.id;
    } else if (status?.status === "failed") {
      await updateUser(auth.uid, { soulJobStatus: "failed" });
      user.soulJobStatus = "failed";
    }
  }

  return NextResponse.json({
    soulJobStatus: user.soulJobStatus,
    soulReferenceId: user.soulReferenceId,
  });
}
