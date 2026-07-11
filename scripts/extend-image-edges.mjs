#!/usr/bin/env node
/**
 * Extend an image to target dimensions by replicating edge pixels (edge color fill).
 * Uses the same border width on all four sides (even extension).
 *
 * Default target: 1320 x 2868 — iPhone 6.9" App Store screenshot (portrait).
 * (6.7" is 1290 x 2796 — different slot in App Store Connect.)
 *
 * Usage:
 *   node scripts/extend-image-edges.mjs <input> [output] [width] [height]
 *
 * Defaults: 1320 x 2868, output = <input-dir>/<input-name>-extended<same-ext-as-input>
 */

import sharp from "sharp";
import path from "node:path";
import { access } from "node:fs/promises";

const DEFAULT_WIDTH = 1320;
const DEFAULT_HEIGHT = 2868;

function clampEdge(coord, size) {
  if (coord < 0) return 0;
  if (coord >= size) return size - 1;
  return coord;
}

function edgeReplicateUniformBorder(srcData, srcW, srcH, channels, targetW, targetH, border) {
  const dst = Buffer.alloc(targetW * targetH * channels);

  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const srcX = clampEdge(x - border, srcW);
      const srcY = clampEdge(y - border, srcH);
      const dstIdx = (y * targetW + x) * channels;
      const srcIdx = (srcY * srcW + srcX) * channels;

      for (let c = 0; c < channels; c++) {
        dst[dstIdx + c] = srcData[srcIdx + c];
      }
    }
  }

  return dst;
}

function evenBorderSize(srcW, srcH, targetW, targetH) {
  const padX = targetW - srcW;
  const padY = targetH - srcH;

  // Smallest uniform border that fits inside the target after a center crop.
  const border = Math.max(Math.ceil(padX / 2), Math.ceil(padY / 2), 0);
  const innerW = targetW - border * 2;
  const innerH = targetH - border * 2;

  if (innerW < 1 || innerH < 1) {
    throw new Error(
      `Target (${targetW}x${targetH}) is too small for even edge extension from ${srcW}x${srcH}.`
    );
  }

  return { border, innerW, innerH };
}

async function extendImage(inputPath, outputPath, targetWidth, targetHeight) {
  const image = sharp(inputPath);
  const meta = await image.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Could not read dimensions from ${inputPath}`);
  }

  const { width, height } = meta;

  if (width > targetWidth || height > targetHeight) {
    throw new Error(
      `Source (${width}x${height}) is larger than target (${targetWidth}x${targetHeight}). ` +
        "This script only adds padding; it does not downscale."
    );
  }

  const { border, innerW, innerH } = evenBorderSize(width, height, targetWidth, targetHeight);
  const cropLeft = Math.floor((width - innerW) / 2);
  const cropTop = Math.floor((height - innerH) / 2);
  const cropRight = width - innerW - cropLeft;
  const cropBottom = height - innerH - cropTop;

  const { data } = await image
    .extract({ left: cropLeft, top: cropTop, width: innerW, height: innerH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const extended = edgeReplicateUniformBorder(
    data,
    innerW,
    innerH,
    4,
    targetWidth,
    targetHeight,
    border
  );

  const pipeline = sharp(extended, {
    raw: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
    },
  }).flatten({ background: { r: 255, g: 255, b: 255 } });

  const ext = path.extname(outputPath).toLowerCase();
  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9 }).toFile(outputPath);
  } else if (ext === ".jpg" || ext === ".jpeg") {
    await pipeline.jpeg({ quality: 95, mozjpeg: true }).toFile(outputPath);
  } else {
    throw new Error(`Unsupported output extension "${ext}". Use .png or .jpg`);
  }

  console.log("Input:", inputPath);
  console.log("Output:", outputPath);
  console.log(`Source: ${width}x${height}`);
  console.log(`Target: ${targetWidth}x${targetHeight}`);
  console.log(`Even border: ${border}px on all sides`);
  if (cropLeft || cropTop || cropRight || cropBottom) {
    console.log(
      `Center crop: left=${cropLeft}, right=${cropRight}, top=${cropTop}, bottom=${cropBottom}`
    );
  } else {
    console.log("Center crop: none");
  }
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error(
    "Usage: node scripts/extend-image-edges.mjs <input> [output] [width] [height]"
  );
  process.exit(1);
}

const parsed = path.parse(inputPath);
const outputPath =
  process.argv[3] ??
  path.join(parsed.dir, `${parsed.name}-extended${parsed.ext || ".jpg"}`);
const targetWidth = Number(process.argv[4] ?? DEFAULT_WIDTH);
const targetHeight = Number(process.argv[5] ?? DEFAULT_HEIGHT);

if (!Number.isFinite(targetWidth) || !Number.isFinite(targetHeight)) {
  console.error("Width and height must be numbers.");
  process.exit(1);
}

try {
  await access(inputPath);
  await extendImage(inputPath, outputPath, targetWidth, targetHeight);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
