import { fal } from "@fal-ai/client";

const NANO_BANANA_2_EDIT = "fal-ai/nano-banana-2/edit";

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
  resolution?: "0.5K" | "1K" | "2K" | "4K";
  aspectRatio?: "auto" | "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}

export interface FalEditResult {
  imageUrl: string;
  description?: string;
}

export async function editImageWithNanoBanana2(
  input: FalEditInput
): Promise<FalEditResult> {
  configureFal();

  console.log("[fal] nano-banana-2 edit request", {
    model: NANO_BANANA_2_EDIT,
    prompt: input.prompt,
    resolution: input.resolution ?? "2K",
    aspectRatio: input.aspectRatio ?? "3:4",
    imageCount: input.imageUrls.length,
  });

  try {
    const result = await fal.subscribe(NANO_BANANA_2_EDIT, {
      input: {
        prompt: input.prompt,
        image_urls: input.imageUrls,
        num_images: 1,
        aspect_ratio: input.aspectRatio ?? "3:4",
        output_format: "png",
        resolution: input.resolution ?? "2K",
        limit_generations: true,
        safety_tolerance: "4",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("[fal] nano-banana-2 edit progress", update.status);
        }
      },
    });

    const data = result.data as { images?: { url: string }[]; description?: string };
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("FAL nano-banana-2 edit returned no image");
    }

    console.log("[fal] nano-banana-2 edit complete", {
      requestId: (result as { requestId?: string }).requestId,
      prompt: input.prompt,
    });

    return {
      imageUrl,
      description: data.description,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[fal] nano-banana-2 edit failed", message);
    throw new Error(message);
  }
}

/** @deprecated Use editImageWithNanoBanana2 */
export const editImageWithNanoBanana = editImageWithNanoBanana2;

export async function removeWatermarkWithFal(imageUrl: string): Promise<string> {
  configureFal();

  const result = await fal.subscribe(NANO_BANANA_2_EDIT, {
    input: {
      prompt:
        "Remove all watermarks, logos, text overlays, and branding from this image. Keep the person and background exactly the same. Output a clean photo with no visible watermarks.",
      image_urls: [imageUrl],
      num_images: 1,
      aspect_ratio: "auto",
      output_format: "png",
      resolution: "1K",
      limit_generations: true,
      safety_tolerance: "4",
    },
    logs: true,
  });

  const data = result.data as { images?: { url: string }[] };
  const cleanedUrl = data.images?.[0]?.url;

  if (!cleanedUrl) {
    console.log("[watermark] FAL removal failed, returning original");
    return imageUrl;
  }

  console.log("[watermark] removed via FAL nano-banana-2");
  return cleanedUrl;
}
