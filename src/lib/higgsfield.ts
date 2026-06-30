import { HiggsfieldClient, InputImageType } from "@higgsfield/client";
import { createHiggsfieldClient } from "@higgsfield/client/v2";

const HIGGSFIELD_BASE_URL = "https://platform.higgsfield.ai";
export const SOUL_CHARACTER_ENDPOINT = "/higgsfield-ai/soul/character";

let client: HiggsfieldClient | null = null;
let v2Client: ReturnType<typeof createHiggsfieldClient> | null = null;

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

function getV2Client() {
  if (!v2Client) {
    const { apiKey, apiSecret } = getCredentials();
    v2Client = createHiggsfieldClient({ apiKey, apiSecret });
  }
  return v2Client;
}

export function isHiggsfieldConfigured(): boolean {
  return Boolean(process.env.HIGGSFIELD_API_KEY && process.env.HIGGSFIELD_API_SECRET);
}

export interface SoulTrainingInput {
  name: string;
  imageUrls: string[];
}

export interface SoulGenerationInput {
  soulReferenceId: string;
  prompt: string;
  imageReferenceUrl: string;
  webhookUrl?: string;
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

/** Generate from Soul ID + style image reference (POST /higgsfield-ai/soul/character). */
export async function generateSoulImage(input: SoulGenerationInput): Promise<HiggsfieldQueuedJob> {
  const hf = getV2Client();
  const webhookSecret = process.env.HIGGSFIELD_WEBHOOK_SECRET || "";

  const response = await hf.subscribe(SOUL_CHARACTER_ENDPOINT, {
    input: {
      prompt: input.prompt,
      custom_reference_id: input.soulReferenceId,
      custom_reference_strength: 1,
      image_reference_url: input.imageReferenceUrl,
      aspect_ratio: "3:4",
      resolution: "1080p",
      enhance_prompt: true,
      batch_size: 1,
      ...(webhookSecret ? { webhook_secret: webhookSecret } : {}),
    },
    withPolling: false,
    webhook: input.webhookUrl
      ? {
          url: input.webhookUrl,
          secret: webhookSecret,
        }
      : undefined,
  });

  const job: HiggsfieldQueuedJob = {
    id: response.request_id,
    status: response.status,
    statusUrl: response.status_url,
  };

  console.log("[higgsfield] soul/character queued", {
    soulReferenceId: input.soulReferenceId,
    imageReferenceUrl: input.imageReferenceUrl,
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

/** List Soul IDs (GET /v1/custom-references/list). */
export async function listSoulCharacters(page = 1, pageSize = 100) {
  const hf = getHiggsfieldClient();
  return hf.listSoulIds(page, pageSize);
}

export async function uploadToHiggsfield(buffer: Buffer, contentType: string) {
  const hf = getHiggsfieldClient();
  return hf.upload(buffer, contentType);
}
