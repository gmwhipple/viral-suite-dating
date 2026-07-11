import sharp from "sharp";
import { SMILE_OPTIONS } from "@/lib/constants";

export { SMILE_OPTIONS };
export type SmileServiceChoice = (typeof SMILE_OPTIONS)[number]["serviceChoice"];

const AILAB_EMOTION_URL = "https://www.ailabapi.com/api/portrait/effects/emotion-editor";
const MAX_DIMENSION = 4096;
const MAX_BYTES = 5 * 1024 * 1024;

export function getAILabApiKey(): string | undefined {
  return (
    process.env.AI_LABS_KEY?.trim() ||
    process.env.AILAB_API_KEY?.trim() ||
    undefined
  );
}

export function isAILabConfigured(): boolean {
  return Boolean(getAILabApiKey());
}

interface AILabResponse {
  error_code?: number;
  error_message?: string;
  error_msg?: string;
  error_code_str?: string;
  error_detail?: {
    code?: string;
    code_message?: string;
    message?: string;
  };
  data?: { image?: string };
  request_id?: string;
}

function formatAILabError(result: AILabResponse): string {
  return (
    result.error_detail?.code_message ||
    result.error_detail?.message ||
    result.error_msg ||
    result.error_message ||
    result.error_code_str ||
    (result.error_code ? `AI Labs error ${result.error_code}` : "AI Labs returned no image")
  );
}

async function prepareJpegBuffer(source: Buffer): Promise<Buffer> {
  let pipeline = sharp(source).rotate();
  const meta = await pipeline.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let quality = 90;
  let output = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  if (output.length > MAX_BYTES) {
    quality = 70;
    output = await sharp(source).rotate().jpeg({ quality, mozjpeg: true }).toBuffer();
  }

  return output;
}

export async function applyEmotionEdit(
  imageSource: Buffer,
  serviceChoice: SmileServiceChoice
): Promise<{ imageBuffer: Buffer; requestId?: string }> {
  const apiKey = getAILabApiKey();
  if (!apiKey) {
    throw new Error("AI Labs is not configured (set AI_LABS_KEY in .env)");
  }

  const jpegBuffer = await prepareJpegBuffer(imageSource);

  const formData = new FormData();
  formData.append(
    "image_target",
    new Blob([new Uint8Array(jpegBuffer)], { type: "image/jpeg" }),
    "image.jpg"
  );
  formData.append("service_choice", String(serviceChoice));

  const response = await fetch(AILAB_EMOTION_URL, {
    method: "POST",
    headers: {
      "ailabapi-api-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI Labs request failed (${response.status}): ${text.slice(0, 200)}`);
  }

  const result = (await response.json()) as AILabResponse;
  if (result.error_code !== 0 || !result.data?.image) {
    throw new Error(formatAILabError(result));
  }

  const imageBuffer = Buffer.from(result.data.image, "base64");
  return { imageBuffer, requestId: result.request_id };
}
