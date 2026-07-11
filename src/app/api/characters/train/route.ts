import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { getOrCreateUser, updateUser, getUserPhotos } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { createSoulCharacter, isHiggsfieldConfigured, pollSoulIdStatus } from "@/lib/higgsfield";
import { getExternalFetchUrl } from "@/lib/storage";
import { getAppBaseUrl } from "@/lib/app-url";
import { MIN_SOUL_TRAINING_PHOTOS } from "@/lib/constants";
import { toPublicErrorMessage } from "@/lib/public-errors";
import {
  characterLabelFromDate,
  createCharacter,
  listUserCharacters,
  syncTrainingCharacter,
  updateCharacter,
} from "@/lib/services/characters";
import { v4 as uuidv4 } from "uuid";

async function resolveTrainingImageUrls(
  photos: Awaited<ReturnType<typeof getUserPhotos>>,
  baseUrl: string
): Promise<string[]> {
  return Promise.all(photos.map((p) => getExternalFetchUrl(p.storageKey, baseUrl)));
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
    const baseUrl = getAppBaseUrl(request);
    const photos = await getUserPhotos(auth.uid, baseUrl);

    if (photos.length < MIN_SOUL_TRAINING_PHOTOS) {
      return NextResponse.json({
        error: `Upload at least ${MIN_SOUL_TRAINING_PHOTOS} photos to train your character`,
      }, { status: 400 });
    }

    const characters = await listUserCharacters(auth.uid);
    const trainingInProgress = characters.some(
      (c) => c.status === "training" || c.status === "pending_training"
    );
    if (trainingInProgress || ["training", "pending_training"].includes(user.soulJobStatus)) {
      return NextResponse.json({ error: "Training already in progress" }, { status: 409 });
    }

    const characterId = uuidv4();
    const label = characterLabelFromDate(new Date().toISOString());
    const firstPhoto = [...photos].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt))[0];

    await createCharacter({
      id: characterId,
      userId: auth.uid,
      label,
      status: "pending_training",
      photoCount: photos.length,
      thumbnailStorageKey: firstPhoto?.storageKey,
    });

    await updateUser(auth.uid, {
      activeCharacterId: characterId,
      soulJobStatus: "pending_training",
      lastTrainingError: undefined,
    });

    const imageUrls = await resolveTrainingImageUrls(photos, baseUrl);
    console.log("[soul/train] starting", {
      uid: auth.uid.slice(0, 8),
      characterId,
      photoCount: photos.length,
    });

    const soulId = await createSoulCharacter({
      name: `user-${auth.uid.slice(0, 8)}`,
      imageUrls,
    });

    await updateCharacter(characterId, {
      status: "training",
      higgsfieldRequestId: soulId.id,
      lastTrainingError: undefined,
    });

    await updateUser(auth.uid, {
      soulJobStatus: "training",
      higgsfieldRequestId: soulId.id,
      lastTrainingError: undefined,
    });

    await logActivity(auth.uid, "soul_training_started", {
      soulId: soulId.id,
      characterId,
      photoCount: photos.length,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      status: "training",
      characterId,
      message: "Your AI character is being trained. We'll notify you when ready.",
    });
  } catch (err) {
    const message = toPublicErrorMessage(err, "Training failed");
    console.log("[characters/train] error", message, err);
    await updateUser(auth.uid, { soulJobStatus: "failed", lastTrainingError: message });
    await syncTrainingCharacter(
      await getOrCreateUser(auth.uid, auth.email, auth.displayName),
      { status: "failed", lastTrainingError: message }
    );
    await logActivity(auth.uid, "soul_training_failed", { error: message }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(auth.uid, auth.email, auth.displayName);
  const characters = await listUserCharacters(auth.uid);
  const activeCharacter =
    characters.find((c) => c.id === user.activeCharacterId) ||
    characters.find((c) => c.status === "training" || c.status === "pending_training");

  const pollId =
    activeCharacter?.higgsfieldRequestId && activeCharacter.status === "training"
      ? activeCharacter.higgsfieldRequestId
      : user.higgsfieldRequestId && user.soulJobStatus === "training"
        ? user.higgsfieldRequestId
        : null;

  if (pollId) {
    const status = await pollSoulIdStatus(pollId);

    if (status?.status === "completed") {
      const characterId = activeCharacter?.id || user.activeCharacterId;
      if (characterId) {
        await updateCharacter(characterId, {
          status: "ready",
          soulReferenceId: status.id,
          lastTrainingError: undefined,
        });
      }
      await updateUser(auth.uid, {
        soulJobStatus: "ready",
        soulReferenceId: status.id,
        lastTrainingError: undefined,
      });
      user.soulJobStatus = "ready";
      user.soulReferenceId = status.id;
    } else if (status?.status === "failed") {
      const failMessage = "Training did not complete. Please try again.";
      const characterId = activeCharacter?.id || user.activeCharacterId;
      if (characterId) {
        await updateCharacter(characterId, {
          status: "failed",
          lastTrainingError: failMessage,
        });
      }
      await updateUser(auth.uid, {
        soulJobStatus: "failed",
        lastTrainingError: failMessage,
      });
      await logActivity(auth.uid, "soul_training_failed", {
        soulId: pollId,
        error: failMessage,
      });
      user.soulJobStatus = "failed";
      user.lastTrainingError = failMessage;
    }
  }

  return NextResponse.json({
    modelStatus: user.soulJobStatus,
    lastTrainingError: user.lastTrainingError,
    activeCharacterId: user.activeCharacterId,
  });
}
