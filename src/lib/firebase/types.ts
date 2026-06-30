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

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  generationsUsed: number;
  generationsLimit: number;
  soulReferenceId?: string;
  soulJobStatus: SoulJobStatus;
  higgsfieldRequestId?: string;
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
  status: GenerationStatus;
  higgsfieldJobId?: string;
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
}
