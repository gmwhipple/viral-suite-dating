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

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  referenceGender?: ReferenceGender;
  plan: UserPlan;
  stripeCustomerId?: string;
  generationsUsed: number;
  generationsLimit: number;
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
  referenceId: string;
  referenceName: string;
  prompt: string;
  imageReferenceUrl?: string;
  imageReferenceKey?: string;
  status: GenerationStatus;
  higgsfieldJobId?: string;
  higgsfieldStatusUrl?: string;
  rawImageUrl?: string;
  finalImageUrl?: string;
  storageKey?: string;
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
  provider: "fal" | "openrouter";
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
  photos: UserPhoto[];
  generations: GenerationJob[];
  edits: EditJob[];
  recentActivity: ActivityLogEntry[];
  catalogReferences: ImageReference[];
  customReferences: ImageReference[];
}
