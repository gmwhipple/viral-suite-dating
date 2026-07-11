export type UserPlan = "free" | "paid" | "expired";

export type SoulJobStatus =
  | "draft"
  | "uploading"
  | "pending_training"
  | "training"
  | "ready"
  | "generating"
  | "completed"
  | "failed";

export type GenerationStatus =
  | "queued"
  | "processing"
  | "watermark_removal"
  | "completed"
  | "failed";

export type EditJobStatus = "queued" | "processing" | "completed" | "failed";

export type ReferenceGender = "men" | "women";

export interface ImageReference {
  id: string;
  name: string;
  storageKey: string;
  publicUrl: string;
  gender: ReferenceGender | "custom";
  source: "catalog" | "custom";
  /** Populated later from Firestore `reference_catalog` (e.g. tennis, dinner). */
  tags?: string[];
}

/** Firestore record for catalog images — tags for filtering thousands of refs. */
export interface CatalogReferenceRecord {
  storageKey: string;
  gender: ReferenceGender;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CharacterStatus =
  | "pending_training"
  | "training"
  | "ready"
  | "failed";

export interface UserCharacter {
  id: string;
  userId: string;
  label: string;
  status: CharacterStatus;
  photoCount: number;
  thumbnailStorageKey?: string;
  soulReferenceId?: string;
  higgsfieldRequestId?: string;
  lastTrainingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  referenceGender?: ReferenceGender;
  activeCharacterId?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  generationsUsed: number;
  generationsLimit: number;
  editsUsed: number;
  editsLimit: number;
  soulReferenceId?: string;
  soulJobStatus: SoulJobStatus;
  higgsfieldRequestId?: string;
  lastTrainingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPhoto {
  id: string;
  userId: string;
  storageKey: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  retentionExpiresAt?: string;
}

export interface StyleReference {
  id: string;
  name: string;
  category: string;
  prompt: string;
  thumbnailUrl: string;
}

export interface GenerationJob {
  id: string;
  userId: string;
  characterId?: string;
  referenceId: string;
  referenceName: string;
  prompt: string;
  imageReferenceUrl?: string;
  imageReferenceKey?: string;
  soulStyleId?: string;
  soulStyleName?: string;
  status: GenerationStatus;
  higgsfieldJobId?: string;
  higgsfieldStatusUrl?: string;
  rawImageUrl?: string;
  finalImageUrl?: string;
  storageKey?: string;
  sourceGenerationId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditJob {
  id: string;
  userId: string;
  sourceGenerationId: string;
  prompt: string;
  attachmentStorageKey?: string;
  attachmentUrl?: string;
  status: EditJobStatus;
  resultImageUrl?: string;
  storageKey?: string;
  provider: "fal" | "openrouter" | "ailab";
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ABTestEvent {
  id: string;
  variant: "A" | "B";
  event: "view" | "cta_click" | "signup" | "purchase";
  sessionId: string;
  userId?: string;
  createdAt: string;
}

export interface DashboardState {
  user: UserProfile;
  characters: UserCharacter[];
  photos: UserPhoto[];
  generations: GenerationJob[];
  limits?: {
    maxPhotos: number;
    maxGenerations: number;
    generationsRemaining: number;
    maxEdits: number;
    editsRemaining: number;
  };
}
