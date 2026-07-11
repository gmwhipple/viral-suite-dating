import { logActivity } from "@/lib/activity-log";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import {
  completeGenerationFromUrl,
  extractResultUrl,
  markGenerationFailed,
} from "@/lib/generation-completion";
import { pollGenerationRequest, pollSoulIdStatus } from "@/lib/higgsfield";
import { getCharacter, listTrainingCharacters, updateCharacter } from "@/lib/services/characters";
import {
  getPollablePendingGenerations,
  getUserProfile,
  updateUser,
} from "@/lib/services/users";
import type { GenerationJob, UserCharacter, UserProfile } from "@/lib/firebase/types";

export interface DashboardSyncResult {
  changed: boolean;
  user?: Pick<
    UserProfile,
    | "soulJobStatus"
    | "soulReferenceId"
    | "higgsfieldRequestId"
    | "lastTrainingError"
    | "activeCharacterId"
    | "generationsUsed"
    | "editsUsed"
  >;
  characters?: UserCharacter[];
  generations?: GenerationJob[];
}

function trainingPollId(
  user: UserProfile,
  trainingCharacters: UserCharacter[]
): string | null {
  const activeCharacter =
    trainingCharacters.find((c) => c.id === user.activeCharacterId) ||
    trainingCharacters.find((c) => c.status === "training");

  if (activeCharacter?.higgsfieldRequestId && activeCharacter.status === "training") {
    return activeCharacter.higgsfieldRequestId;
  }

  if (user.higgsfieldRequestId && user.soulJobStatus === "training") {
    return user.higgsfieldRequestId;
  }

  return null;
}

async function syncTrainingJob(
  user: UserProfile,
  trainingCharacters: UserCharacter[]
): Promise<{ changed: boolean; user?: UserProfile; characters?: UserCharacter[] }> {
  const pollId = trainingPollId(user, trainingCharacters);
  if (!pollId) {
    return { changed: false };
  }

  const status = await pollSoulIdStatus(pollId);
  if (!status?.status || status.status === "processing" || status.status === "pending") {
    return { changed: false };
  }

  const activeCharacter =
    trainingCharacters.find((c) => c.id === user.activeCharacterId) ||
    trainingCharacters.find((c) => c.status === "training");
  const characterId = activeCharacter?.id || user.activeCharacterId;
  const updatedCharacters: UserCharacter[] = [];

  if (status.status === "completed") {
    if (characterId) {
      await updateCharacter(characterId, {
        status: "ready",
        soulReferenceId: status.id,
        lastTrainingError: undefined,
      });
      const character = await getCharacter(user.uid, characterId);
      if (character) updatedCharacters.push(character);
    }

    await updateUser(user.uid, {
      soulJobStatus: "ready",
      soulReferenceId: status.id,
      lastTrainingError: undefined,
    });

    return {
      changed: true,
      user: {
        ...user,
        soulJobStatus: "ready",
        soulReferenceId: status.id,
        lastTrainingError: undefined,
      },
      characters: updatedCharacters.length > 0 ? updatedCharacters : undefined,
    };
  }

  const failMessage = "Training did not complete. Please try again.";
  if (characterId) {
    await updateCharacter(characterId, {
      status: "failed",
      lastTrainingError: failMessage,
    });
    const character = await getCharacter(user.uid, characterId);
    if (character) updatedCharacters.push(character);
  }

  await updateUser(user.uid, {
    soulJobStatus: "failed",
    lastTrainingError: failMessage,
  });

  await logActivity(user.uid, "soul_training_failed", {
    soulId: pollId,
    error: failMessage,
  });

  return {
    changed: true,
    user: {
      ...user,
      soulJobStatus: "failed",
      lastTrainingError: failMessage,
    },
    characters: updatedCharacters.length > 0 ? updatedCharacters : undefined,
  };
}

async function loadGeneration(generationId: string): Promise<GenerationJob | null> {
  if (!isAdminConfigured()) return null;
  const snap = await getAdminDb().collection(COLLECTIONS.generations).doc(generationId).get();
  if (!snap.exists) return null;
  return snap.data() as GenerationJob;
}

async function syncGenerationJob(generation: GenerationJob): Promise<GenerationJob | null> {
  const status = await pollGenerationRequest(generation.higgsfieldJobId!);
  if (!status) return null;

  if (status.status === "failed" || status.status === "nsfw" || status.status === "canceled") {
    await markGenerationFailed(generation.id, generation.userId, "Generation did not complete");
    return loadGeneration(generation.id);
  }

  if (status.status !== "completed") return null;

  const resultUrl = extractResultUrl(status as Record<string, unknown>);
  if (!resultUrl) return null;

  await completeGenerationFromUrl(generation, resultUrl);
  return loadGeneration(generation.id);
}

export async function syncDashboardJobs(userId: string): Promise<DashboardSyncResult> {
  const user = await getUserProfile(userId);
  if (!user) {
    return { changed: false };
  }

  const needsTrainingSync = user.soulJobStatus === "training";
  const pendingGenerations = await getPollablePendingGenerations(userId);

  if (!needsTrainingSync && pendingGenerations.length === 0) {
    return { changed: false };
  }

  const trainingCharacters = needsTrainingSync ? await listTrainingCharacters(userId) : [];
  let changed = false;
  let nextUser: UserProfile | undefined;
  let nextCharacters: UserCharacter[] | undefined;
  const updatedGenerations: GenerationJob[] = [];

  if (needsTrainingSync) {
    const trainingResult = await syncTrainingJob(user, trainingCharacters);
    if (trainingResult.changed) {
      changed = true;
      nextUser = trainingResult.user;
      nextCharacters = trainingResult.characters;
    }
  }

  if (pendingGenerations.length > 0) {
    const results = await Promise.all(pendingGenerations.map((job) => syncGenerationJob(job)));
    for (const updated of results) {
      if (!updated) continue;
      changed = true;
      updatedGenerations.push(updated);
    }

    if (updatedGenerations.some((g) => g.status === "completed")) {
      await updateUser(userId, { soulJobStatus: "ready" });
      changed = true;
      nextUser = {
        ...(nextUser || user),
        soulJobStatus: "ready",
      };
    }
  }

  if (!changed) {
    return { changed: false };
  }

  const mergedUser = nextUser || user;

  return {
    changed: true,
    user: {
      soulJobStatus: mergedUser.soulJobStatus,
      soulReferenceId: mergedUser.soulReferenceId,
      higgsfieldRequestId: mergedUser.higgsfieldRequestId,
      lastTrainingError: mergedUser.lastTrainingError,
      activeCharacterId: mergedUser.activeCharacterId,
      generationsUsed: mergedUser.generationsUsed,
      editsUsed: mergedUser.editsUsed,
    },
    characters: nextCharacters,
    generations: updatedGenerations.length > 0 ? updatedGenerations : undefined,
  };
}
