import { HiggsfieldClient, InputImageType } from "@higgsfield/client";

const HIGGSFIELD_BASE_URL = "https://platform.higgsfield.ai";
export const SOUL_CHARACTER_ENDPOINT = "/higgsfield-ai/soul/character";

let client: HiggsfieldClient | null = null;

function getCredentials() {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  const apiSecret = process.env.HIGGSFIELD_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Higgsfield API credentials not configured");
  }

  return { apiKey, apiSecret };
}

function getAuthHeaders(): Record<string, string> {
  const { apiKey, apiSecret } = getCredentials();
  return {
    "hf-api-key": apiKey,
    "hf-secret": apiSecret,
    "Content-Type": "application/json",
  };
}

export function getHiggsfieldClient(): HiggsfieldClient {
  if (!client) {
    const { apiKey, apiSecret } = getCredentials();
    client = new HiggsfieldClient({ apiKey, apiSecret });
  }
  return client;
}

export function isHiggsfieldConfigured(): boolean {
  return Boolean(process.env.HIGGSFIELD_API_KEY && process.env.HIGGSFIELD_API_SECRET);
}

export interface SoulTrainingInput {
  name: string;
  imageUrls: string[];
}

export interface SoulStyle {
  id: string;
  name: string;
  description?: string | null;
  preview_url: string;
}

export interface SoulGenerationInput {
  soulReferenceId: string;
  prompt: string;
  imageReferenceUrl?: string;
  styleId?: string;
  enhancePrompt?: boolean;
  customReferenceStrength?: number;
}

export interface HiggsfieldQueuedJob {
  id: string;
  status?: string;
  statusUrl?: string;
}

/** Train a Soul ID character (POST /v1/custom-references, Soul 2.0). */
export async function createSoulCharacter(input: SoulTrainingInput) {
  const hf = getHiggsfieldClient();

  const soulId = await hf.createSoulId(
    {
      name: input.name,
      type: "soul-2",
      input_images: input.imageUrls.map((url) => ({
        type: InputImageType.IMAGE_URL,
        image_url: url,
      })),
    } as Parameters<HiggsfieldClient["createSoulId"]>[0] & { type: string },
    false
  );

  console.log("[higgsfield] soul-id training queued", {
    soulId: soulId.id,
    status: soulId.status,
  });

  return soulId;
}

/** Generate from Soul ID + optional style image reference (POST /higgsfield-ai/soul/character). */
export async function generateSoulImage(input: SoulGenerationInput): Promise<HiggsfieldQueuedJob> {
  const { apiKey, apiSecret } = getCredentials();

  const response = await fetch(`${HIGGSFIELD_BASE_URL}${SOUL_CHARACTER_ENDPOINT}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      Authorization: `Key ${apiKey}:${apiSecret}`,
    },
    body: JSON.stringify({
      prompt: input.prompt,
      custom_reference_id: input.soulReferenceId,
      custom_reference_strength: input.customReferenceStrength ?? 1,
      ...(input.imageReferenceUrl ? { image_reference_url: input.imageReferenceUrl } : {}),
      ...(input.styleId ? { style_id: input.styleId } : {}),
      aspect_ratio: "3:4",
      resolution: "1080p",
      enhance_prompt: input.enhancePrompt !== false,
      batch_size: 1,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.log("[higgsfield] generation submit failed", response.status, detail.slice(0, 200));
    throw new Error("Generation request failed");
  }

  const data = (await response.json()) as {
    request_id: string;
    status?: string;
    status_url?: string;
  };

  const job: HiggsfieldQueuedJob = {
    id: data.request_id,
    status: data.status,
    statusUrl: data.status_url,
  };

  console.log("[higgsfield] generation queued (poll for completion)", {
    soulReferenceId: input.soulReferenceId,
    imageReferenceUrl: input.imageReferenceUrl ?? null,
    styleId: input.styleId ?? null,
    requestId: job.id,
    status: job.status,
  });

  return job;
}

/** Poll a generation request (GET /requests/{request_id}/status). */
export async function pollGenerationRequest(requestId: string) {
  const { apiKey, apiSecret } = getCredentials();
  const response = await fetch(`${HIGGSFIELD_BASE_URL}/requests/${requestId}/status`, {
    headers: {
      ...getAuthHeaders(),
      Authorization: `Key ${apiKey}:${apiSecret}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.log("[higgsfield] poll generation failed", requestId, response.status);
    return null;
  }

  return response.json() as Promise<{
    status: string;
    request_id?: string;
    images?: Array<{ url: string }>;
    jobs?: Array<{ results?: { raw?: { url?: string }; min?: { url?: string } } }>;
  }>;
}

/** Poll a single Soul ID (GET /v1/custom-references/{id}). */
export async function pollSoulIdStatus(soulId: string) {
  const response = await fetch(`${HIGGSFIELD_BASE_URL}/v1/custom-references/${soulId}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    console.log("[higgsfield] poll soul-id failed", soulId, response.status);
    return null;
  }

  return response.json() as Promise<{ id: string; status: string; name?: string }>;
}

/** List Soul text-to-image styles (GET /v1/text2image/soul-styles). */
export async function listSoulStyles(): Promise<SoulStyle[]> {
  const response = await fetch(`${HIGGSFIELD_BASE_URL}/v1/text2image/soul-styles`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.log("[higgsfield] list soul styles failed", response.status, detail.slice(0, 200));
    throw new Error("Failed to load soul styles");
  }

  const styles = (await response.json()) as SoulStyle[];
  console.log("[higgsfield] soul styles loaded", { count: styles.length });
  return styles;
}

/** List Soul IDs (GET /v1/custom-references/list). */
export async function listSoulCharacters(page = 1, pageSize = 100) {
  const hf = getHiggsfieldClient();
  return hf.listSoulIds(page, pageSize);
}

export async function uploadToHiggsfield(buffer: Buffer, contentType: string) {
  const hf = getHiggsfieldClient();
  return hf.upload(buffer, contentType);
}
