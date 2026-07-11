#!/usr/bin/env node
/**
 * Localize the landing "It's a Match" screenshot into every supported locale
 * using fal.ai openai/gpt-image-2/edit — 5 locales per batch with a review pause.
 *
 * Setup:
 *   FAL_KEY=... in .env.local (or .env)
 *
 * Edit per-locale prompts in:
 *   scripts/match-image-prompts.json
 *
 * Usage:
 *   node scripts/translate-match-image.mjs
 *   node scripts/translate-match-image.mjs --auto
 *   node scripts/translate-match-image.mjs --only es,fr,de,hu
 *   node scripts/translate-match-image.mjs --force
 *   node scripts/translate-match-image.mjs --dry-run
 *   node scripts/translate-match-image.mjs --batch-size 3 --from-batch 2
 */

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import { fal } from "@fal-ai/client";

const DEFAULT_CONFIG = path.join(process.cwd(), "scripts/match-image-prompts.json");
const FAL_MODEL = "openai/gpt-image-2/edit";

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(process.cwd(), name);
    if (!existsSync(envPath)) continue;

    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {
    configPath: DEFAULT_CONFIG,
    auto: false,
    force: false,
    dryRun: false,
    batchSize: null,
    fromBatch: 1,
    only: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--auto") options.auto = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--config") options.configPath = argv[++i];
    else if (arg === "--batch-size") options.batchSize = Number(argv[++i]);
    else if (arg === "--from-batch") options.fromBatch = Number(argv[++i]);
    else if (arg === "--only") options.only = argv[++i]?.split(",").map((s) => s.trim()).filter(Boolean);
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/translate-match-image.mjs [options]

Options:
  --config <path>       Prompt config JSON (default: scripts/match-image-prompts.json)
  --batch-size <n>      Override batch size from config
  --from-batch <n>      Start at batch number (1-based)
  --only <a,b,c>        Run only these locale codes
  --auto                Skip review pause between batches
  --force               Regenerate even if output already exists
  --dry-run             Print prompts and batches without calling fal
  --help                Show this help
`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  return options;
}

function fillPrompt(template, locale, languageName, vars = {}) {
  let result = template
    .replaceAll("{locale}", locale)
    .replaceAll("{languageName}", languageName);

  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }

  return result;
}

function resolvePrompt(config, locale, entry) {
  const languageName = entry.languageName || locale;

  if (typeof entry.prompt === "string" && entry.prompt.trim()) {
    return entry.prompt.trim();
  }

  if (entry.screenText && entry.bubbleText) {
    return fillPrompt(config.fullCoveragePrompt || config.nativeTargetPrompt, locale, languageName, {
      screenText: entry.screenText.trim(),
      bubbleText: entry.bubbleText.trim(),
      matchRule: entry.matchRule?.trim() || "Translate match fully into the native language.",
      targetText: entry.targetText?.trim() || entry.screenText.trim(),
    });
  }

  if (typeof entry.targetText === "string" && entry.targetText.trim()) {
    const targetText = entry.targetText.trim();
    return fillPrompt(config.fullCoveragePrompt || config.defaultPrompt, locale, languageName, {
      screenText: targetText,
      bubbleText: targetText,
      matchRule:
        entry.matchRule?.trim() ||
        "Use native script only — translate match fully, no English letters.",
    });
  }

  return fillPrompt(config.defaultPrompt, locale, languageName);
}

function chunk(items, size) {
  const batches = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function loadConfig(configPath) {
  const raw = await readFile(configPath, "utf8");
  return JSON.parse(raw);
}

async function loadManifest(manifestPath) {
  try {
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return { results: {} };
  }
}

async function saveManifest(manifestPath, manifest) {
  manifest.updatedAt = new Date().toISOString();
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

async function uploadSourceImage(imagePath) {
  const absolute = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
  await access(absolute);

  const buffer = await readFile(absolute);
  const ext = path.extname(absolute).toLowerCase();
  const mime =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";

  const blob = new Blob([buffer], { type: mime });
  const url = await fal.storage.upload(blob);
  console.log("[upload] source image:", url);
  return url;
}

async function runFalEdit({ model, prompt, imageUrl }) {
  const result = await fal.subscribe(model, {
    input: {
      prompt,
      image_urls: [imageUrl],
      image_size: "auto",
      quality: "high",
      num_images: 1,
      output_format: "png",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS" && update.logs?.length) {
        const last = update.logs[update.logs.length - 1]?.message;
        if (last) console.log("[fal]", last);
      }
    },
  });

  const image = result.data?.images?.[0];
  if (!image?.url) {
    throw new Error("fal returned no image URL");
  }

  return {
    url: image.url,
    width: image.width,
    height: image.height,
    requestId: result.requestId,
  };
}

async function downloadImage(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outputPath, buffer);
}

async function waitForReview(batchIndex, totalBatches, locales, outputDir) {
  console.log("");
  console.log(`Batch ${batchIndex}/${totalBatches} finished: ${locales.join(", ")}`);
  console.log(`Review outputs in: ${outputDir}`);
  for (const locale of locales) {
    console.log(`  - ${path.join(outputDir, `${locale}.png`)}`);
  }
  console.log("");

  const rl = createInterface({ input, output });
  await rl.question("Press Enter to run the next batch (Ctrl+C to stop)... ");
  rl.close();
}

function buildQueue(config, options, manifest, outputDir) {
  const entries = [];

  for (const [locale, entry] of Object.entries(config.locales)) {
    if (options.only && !options.only.includes(locale)) continue;
    if (entry.skip) continue;

    const outputPath = path.join(outputDir, `${locale}.png`);
    const alreadyDone = existsSync(outputPath) || manifest.results?.[locale]?.status === "done";
    if (alreadyDone && !options.force) continue;

    const languageName = entry.languageName || locale;
    const prompt = resolvePrompt(config, locale, entry);

    entries.push({ locale, languageName, prompt, outputPath, targetText: entry.targetText || null });
  }

  return entries;
}

async function main() {
  loadEnvFiles();
  const options = parseArgs(process.argv.slice(2));

  const falKey = process.env.FAL_KEY?.trim();
  if (!falKey && !options.dryRun) {
    console.error("Missing FAL_KEY. Add it to .env.local or export it in your shell.");
    process.exit(1);
  }

  if (falKey) {
    fal.config({ credentials: falKey });
  }

  const config = await loadConfig(options.configPath);
  const sourceImage = config.sourceImage || "public/landing/its-a-match.png";
  const outputDir = path.isAbsolute(config.outputDir)
    ? config.outputDir
    : path.join(process.cwd(), config.outputDir || "public/landing/match-localized");
  const batchSize = options.batchSize || config.batchSize || 5;
  const model = config.falModel || FAL_MODEL;
  const manifestPath = path.join(outputDir, "manifest.json");

  await mkdir(outputDir, { recursive: true });
  const manifest = await loadManifest(manifestPath);

  const queue = buildQueue(config, options, manifest, outputDir);
  const batches = chunk(queue, batchSize);

  if (queue.length === 0) {
    console.log("Nothing to do. All locales are done or skipped.");
    console.log(`Outputs: ${outputDir}`);
    console.log("Use --force to regenerate, or edit scripts/match-image-prompts.json");
    return;
  }

  console.log(`Model: ${model}`);
  console.log(`Source: ${sourceImage}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Locales queued: ${queue.length} in ${batches.length} batch(es) of ${batchSize}`);
  console.log("");

  if (options.dryRun) {
    batches.forEach((batch, index) => {
      console.log(`--- Batch ${index + 1}/${batches.length} ---`);
      for (const item of batch) {
        console.log(`[${item.locale}] ${item.languageName}${item.targetText ? ` → "${item.targetText}"` : ""}`);
        console.log(item.prompt);
        console.log("");
      }
    });
    return;
  }

  if (options.fromBatch > 1) {
    if (options.fromBatch > batches.length) {
      console.error(`--from-batch ${options.fromBatch} is greater than total batches (${batches.length})`);
      process.exit(1);
    }
    console.log(`Starting at batch ${options.fromBatch}/${batches.length}`);
  }

  let sourceImageUrl = manifest.sourceImageUrl;
  if (!sourceImageUrl) {
    sourceImageUrl = await uploadSourceImage(sourceImage);
    manifest.sourceImageUrl = sourceImageUrl;
    await saveManifest(manifestPath, manifest);
  } else {
    console.log("[upload] reusing cached source URL from manifest");
  }

  for (let batchIndex = options.fromBatch; batchIndex <= batches.length; batchIndex++) {
    const batch = batches[batchIndex - 1];
    console.log(`--- Batch ${batchIndex}/${batches.length}: ${batch.map((b) => b.locale).join(", ")} ---`);

    const results = await Promise.all(
      batch.map(async (item) => {
        console.log(`[${item.locale}] submitting...`);
        try {
          const result = await runFalEdit({
            model,
            prompt: item.prompt,
            imageUrl: sourceImageUrl,
          });

          await downloadImage(result.url, item.outputPath);

          manifest.results[item.locale] = {
            status: "done",
            output: item.outputPath,
            falUrl: result.url,
            requestId: result.requestId,
            width: result.width,
            height: result.height,
            prompt: item.prompt,
            completedAt: new Date().toISOString(),
          };

          console.log(`[${item.locale}] saved ${item.outputPath}`);
          return { locale: item.locale, ok: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          manifest.results[item.locale] = {
            status: "error",
            error: message,
            prompt: item.prompt,
            failedAt: new Date().toISOString(),
          };
          console.error(`[${item.locale}] failed: ${message}`);
          return { locale: item.locale, ok: false, error: message };
        }
      })
    );

    await saveManifest(manifestPath, manifest);

    const failed = results.filter((r) => !r.ok);
    if (failed.length) {
      console.log(`Batch had ${failed.length} failure(s): ${failed.map((f) => f.locale).join(", ")}`);
    }

    if (batchIndex < batches.length && !options.auto) {
      await waitForReview(
        batchIndex,
        batches.length,
        batch.map((b) => b.locale),
        outputDir
      );
    }
  }

  console.log("");
  console.log("All batches complete.");
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Images: ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
