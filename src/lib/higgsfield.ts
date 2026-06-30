import { HiggsfieldClient, InputImageType } from "@higgsfield/client";

let client: HiggsfieldClient | null = null;

export function getHiggsfieldClient(): HiggsfieldClient {
  if (!client) {
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    const apiSecret = process.env.HIGGSFIELD_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("Higgsfield API credentials not configured");
    }

    client = new HiggsfieldClient({
      apiKey,
      apiSecret,
    });
  }
  return client;
}

export function isHiggsfieldConfigured(): boolean {
  return Boolean(process.env.HIGGSFIELD_API_KEY && process.env.HIGGSFIELD_API_SECRET);
}

export const SOUL_ENDPOINT = "/v1/text2image/soul";
export const SOUL_V2_JOB_TYPE = "text2image_soul_v2";

export interface SoulTrainingInput {
  name: string;
  imageUrls: string[];
}

export interface SoulGenerationInput {
  soulReferenceId: string;
  prompt: string;
  webhookUrl?: string;
}

export async function createSoulCharacter(input: SoulTrainingInput) {
  const hf = getHiggsfieldClient();

  const soulId = await hf.createSoulId(
    {
      name: input.name,
      input_images: input.imageUrls.map((url) => ({
        type: InputImageType.IMAGE_URL,
        image_url: url,
      })),
    },
    false
  );

  return soulId;
}

export async function generateSoulImage(input: SoulGenerationInput) {
  const hf = getHiggsfieldClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  const jobSet = await hf.generate(
    SOUL_ENDPOINT,
    {
      prompt: input.prompt,
      custom_reference_id: input.soulReferenceId,
      custom_reference_strength: 0.85,
      width_and_height: "1536x2048",
      quality: "hd",
      batch_size: 1,
      job_set_type: SOUL_V2_JOB_TYPE,
    },
    {
      withPolling: false,
      webhook: input.webhookUrl
        ? {
            url: input.webhookUrl,
            secret: process.env.HIGGSFIELD_WEBHOOK_SECRET || "",
          }
        : undefined,
    }
  );

  console.log("[higgsfield] generation queued", {
    soulReferenceId: input.soulReferenceId,
    jobId: jobSet?.id,
  });

  return jobSet;
}

export async function pollSoulIdStatus(soulId: string) {
  const hf = getHiggsfieldClient();
  const list = await hf.listSoulIds(1, 100);
  const item = list.items.find((s) => s.id === soulId);
  return item || null;
}

export async function uploadToHiggsfield(buffer: Buffer, contentType: string) {
  const hf = getHiggsfieldClient();
  return hf.upload(buffer, contentType);
}
