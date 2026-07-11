import type {
  GenerationJob,
  SoulJobStatus,
  UserCharacter,
  UserProfile,
} from "@/lib/firebase/types";

/** Client-safe training/generation lifecycle status. */
export type ModelStatus = SoulJobStatus;

export interface ClientUserProfile {
  uid: string;
  email: string;
  displayName?: string;
  referenceGender?: UserProfile["referenceGender"];
  activeCharacterId?: string;
  plan: UserProfile["plan"];
  generationsUsed: number;
  generationsLimit: number;
  editsUsed: number;
  editsLimit: number;
  modelStatus: ModelStatus;
  lastTrainingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientCharacter {
  id: string;
  userId: string;
  label: string;
  status: UserCharacter["status"];
  photoCount: number;
  thumbnailUrl?: string;
  lastTrainingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientGeneration {
  id: string;
  userId: string;
  characterId?: string;
  referenceId: string;
  referenceName: string;
  prompt: string;
  imageReferenceUrl?: string;
  status: GenerationJob["status"];
  finalImageUrl?: string;
  storageKey?: string;
  sourceGenerationId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDashboardPayload {
  user: ClientUserProfile;
  characters: ClientCharacter[];
  photos: Array<{
    id: string;
    userId: string;
    storageKey: string;
    publicUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
    retentionExpiresAt?: string;
  }>;
  generations: ClientGeneration[];
  limits: {
    maxPhotos: number;
    maxGenerations: number;
    generationsRemaining: number;
    maxEdits: number;
    editsRemaining: number;
  };
}

export function sanitizeUserProfile(user: UserProfile): ClientUserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    referenceGender: user.referenceGender,
    activeCharacterId: user.activeCharacterId,
    plan: user.plan,
    generationsUsed: user.generationsUsed,
    generationsLimit: user.generationsLimit,
    editsUsed: user.editsUsed,
    editsLimit: user.editsLimit,
    modelStatus: user.soulJobStatus,
    lastTrainingError: user.lastTrainingError,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function sanitizeCharacter(
  character: UserCharacter & { thumbnailUrl?: string }
): ClientCharacter {
  return {
    id: character.id,
    userId: character.userId,
    label: character.label,
    status: character.status,
    photoCount: character.photoCount,
    thumbnailUrl: character.thumbnailUrl,
    lastTrainingError: character.lastTrainingError,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
  };
}

export function sanitizeGeneration(generation: GenerationJob): ClientGeneration {
  return {
    id: generation.id,
    userId: generation.userId,
    characterId: generation.characterId,
    referenceId: generation.referenceId,
    referenceName: generation.referenceName,
    prompt: generation.prompt,
    imageReferenceUrl: generation.imageReferenceUrl || generation.finalImageUrl,
    status: generation.status,
    finalImageUrl: generation.finalImageUrl,
    storageKey: generation.storageKey,
    sourceGenerationId: generation.sourceGenerationId,
    error: generation.error,
    createdAt: generation.createdAt,
    updatedAt: generation.updatedAt,
  };
}

export function sanitizeDashboardPayload(payload: {
  user: UserProfile;
  characters: Array<UserCharacter & { thumbnailUrl?: string }>;
  photos: ClientDashboardPayload["photos"];
  generations: GenerationJob[];
  limits: ClientDashboardPayload["limits"];
}): ClientDashboardPayload {
  return {
    user: sanitizeUserProfile(payload.user),
    characters: payload.characters.map(sanitizeCharacter),
    photos: payload.photos,
    generations: payload.generations.map(sanitizeGeneration),
    limits: payload.limits,
  };
}

export function sanitizeSyncPayload(payload: {
  changed: boolean;
  user?: Partial<UserProfile>;
  characters?: Array<UserCharacter & { thumbnailUrl?: string }>;
  generations?: GenerationJob[];
}) {
  if (!payload.changed) return { changed: false as const };

  return {
    changed: true as const,
    user: payload.user
      ? {
          modelStatus: payload.user.soulJobStatus,
          lastTrainingError: payload.user.lastTrainingError,
          activeCharacterId: payload.user.activeCharacterId,
          generationsUsed: payload.user.generationsUsed,
          editsUsed: payload.user.editsUsed,
        }
      : undefined,
    characters: payload.characters?.map(sanitizeCharacter),
    generations: payload.generations?.map(sanitizeGeneration),
  };
}
