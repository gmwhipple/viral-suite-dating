import { v4 as uuidv4 } from "uuid";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import type { GenerationJob } from "@/lib/firebase/types";

export async function createEditedGeneration(
  source: GenerationJob | null,
  userId: string,
  input: {
    sourceGenerationId: string;
    prompt: string;
    finalImageUrl: string;
    storageKey: string;
    referenceName?: string;
  }
): Promise<GenerationJob> {
  const id = uuidv4();
  const now = new Date().toISOString();

  const generation: GenerationJob = {
    id,
    userId,
    characterId: source?.characterId,
    referenceId: source?.referenceId || "edit",
    referenceName: input.referenceName || source?.referenceName || "Edited photo",
    prompt: input.prompt,
    imageReferenceUrl: source?.finalImageUrl || source?.imageReferenceUrl,
    imageReferenceKey: source?.imageReferenceKey,
    sourceGenerationId: input.sourceGenerationId,
    status: "completed",
    finalImageUrl: input.finalImageUrl,
    storageKey: input.storageKey,
    createdAt: now,
    updatedAt: now,
  };

  if (isAdminConfigured()) {
    await getAdminDb().collection(COLLECTIONS.generations).doc(id).set(generation);
  }

  return generation;
}
