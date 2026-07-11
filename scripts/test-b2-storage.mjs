#!/usr/bin/env node
/**
 * Quick B2 connectivity check. Run: npm run storage:b2-test
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

function normalizeEndpoint(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

const accessKeyId = process.env.B2_APPLICATION_KEY_ID?.trim();
const secretAccessKey = process.env.B2_APPLICATION_KEY?.trim();
const bucket = process.env.B2_BUCKET?.trim();
const region = process.env.B2_REGION?.trim() || "us-east-005";
const endpoint = normalizeEndpoint(process.env.B2_S3_ENDPOINT);

if (!accessKeyId || !secretAccessKey || !bucket || !endpoint) {
  console.error("Missing B2 env vars. Need B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET, B2_S3_ENDPOINT.");
  process.exit(1);
}

const client = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

async function main() {
  const testKey = `_healthcheck/${Date.now()}.txt`;

  console.log("Uploading test object...");
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: Buffer.from("viral-suite-dating b2 ok"),
      ContentType: "text/plain",
    })
  );

  console.log("Listing references/men/ prefix...");
  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: "references/men/",
      MaxKeys: 10,
    })
  );
  const count = (listed.Contents || []).filter((item) => item.Key && !item.Key.endsWith("/")).length;
  console.log(`Found ${count} file(s) under references/men/ (first page)`);

  console.log("Cleaning up test object...");
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: testKey,
    })
  );

  console.log("B2 connection OK.");
}

main().catch((err) => {
  console.error("B2 test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
