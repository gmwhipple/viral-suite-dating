import sharp from "sharp";
import { removeWatermarkWithFal, isFalConfigured } from "@/lib/fal";

export async function removeWatermark(imageBuffer: Buffer): Promise<Buffer> {
  if (isFalConfigured()) {
    try {
      const base64 = imageBuffer.toString("base64");
      const dataUrl = `data:image/png;base64,${base64}`;

      const cleanedUrl = await removeWatermarkWithFal(dataUrl);
      if (cleanedUrl.startsWith("http")) {
        const res = await fetch(cleanedUrl);
        if (res.ok) {
          return Buffer.from(await res.arrayBuffer());
        }
      }
    } catch (err) {
      console.log("[watermark] FAL path failed, using sharp fallback", err);
    }
  }

  return removeWatermarkWithSharp(imageBuffer);
}

async function removeWatermarkWithSharp(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;

  const cornerHeight = Math.round(height * 0.08);
  const cornerWidth = Math.round(width * 0.25);

  const regions = [
    { left: 0, top: height - cornerHeight, width: cornerWidth, height: cornerHeight },
    { left: width - cornerWidth, top: height - cornerHeight, width: cornerWidth, height: cornerHeight },
    { left: 0, top: 0, width: cornerWidth, height: Math.round(height * 0.06) },
    { left: width - cornerWidth, top: 0, width: cornerWidth, height: Math.round(height * 0.06) },
  ];

  let pipeline = sharp(imageBuffer);

  for (const region of regions) {
    const sampleLeft = Math.max(0, region.left - 5);
    const sampleTop = Math.max(0, region.top - 20);
    const sample = await sharp(imageBuffer)
      .extract({
        left: sampleLeft,
        top: sampleTop,
        width: Math.min(region.width, width - sampleLeft),
        height: Math.min(20, height - sampleTop),
      })
      .blur(8)
      .resize(region.width, region.height, { fit: "fill" })
      .toBuffer();

    pipeline = pipeline.composite([{ input: sample, left: region.left, top: region.top }]);
  }

  console.log("[watermark] removed via sharp corner inpaint");
  return pipeline.png().toBuffer();
}

export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
