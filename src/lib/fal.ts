import { fal } from "@fal-ai/client";

export function configureFal() {
  const key = process.env.FAL_KEY;
  if (key) {
    fal.config({ credentials: key });
  }
}

export function isFalConfigured(): boolean {
  return Boolean(process.env.FAL_KEY);
}

export interface FalEditInput {
  prompt: string;
  imageUrls: string[];
}

export interface FalEditResult {
  imageUrl: string;
  description?: string;
}

export async function editImageWithNanoBanana(
  input: FalEditInput
): Promise<FalEditResult> {
  configureFal();

  const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
    input: {
      prompt: input.prompt,
      image_urls: input.imageUrls,
      num_images: 1,
      output_format: "png",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log("[fal] edit progress", update.status);
      }
    },
  });

  const data = result.data as { images?: { url: string }[]; description?: string };
  const imageUrl = data.images?.[0]?.url;

  if (!imageUrl) {
    throw new Error("FAL edit returned no image");
  }

  console.log("[fal] edit complete", { prompt: input.prompt.slice(0, 80) });

  return {
    imageUrl,
    description: data.description,
  };
}

export async function removeWatermarkWithFal(imageUrl: string): Promise<string> {
  configureFal();

  const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
    input: {
      prompt:
        "Remove all watermarks, logos, text overlays, and branding from this image. Keep the person and background exactly the same. Output a clean photo with no visible watermarks.",
      image_urls: [imageUrl],
      num_images: 1,
      output_format: "png",
    },
    logs: true,
  });

  const data = result.data as { images?: { url: string }[] };
  const cleanedUrl = data.images?.[0]?.url;

  if (!cleanedUrl) {
    console.log("[watermark] FAL removal failed, returning original");
    return imageUrl;
  }

  console.log("[watermark] removed via FAL nano-banana");
  return cleanedUrl;
}
