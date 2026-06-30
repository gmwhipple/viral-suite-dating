#!/usr/bin/env node
/**
 * Creates Firebase Storage folder placeholders and applies a 30-day
 * lifecycle delete rule for all objects under users/.
 *
 * Usage: npm run storage:setup
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env optional if vars already exported
  }
}

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY || "";
  return key.replace(/\\n/g, "\n");
}

function getBucketName() {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    ""
  );
}

const FOLDER_PLACEHOLDERS = [
  "references/men/.keep",
  "references/women/.keep",
];

const LIFECYCLE_RULES = {
  rule: [
    {
      action: { type: "Delete" },
      condition: {
        age: 30,
        matchesPrefix: ["users/"],
      },
    },
  ],
};

async function main() {
  loadEnv();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const bucketName = getBucketName();

  if (!projectId || !clientEmail || !privateKey) {
    console.error("[storage:setup] Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY");
    process.exit(1);
  }
  if (!bucketName) {
    console.error("[storage:setup] Missing FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: bucketName,
    });
  }

  const bucket = getStorage().bucket(bucketName);
  const keepBody = Buffer.from("placeholder — upload reference images alongside this file\n");

  console.log("[storage:setup] Bucket:", bucketName);

  for (const objectPath of FOLDER_PLACEHOLDERS) {
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();
    if (exists) {
      console.log("[storage:setup] exists:", objectPath);
      continue;
    }
    await file.save(keepBody, {
      metadata: { contentType: "text/plain" },
      resumable: false,
    });
    console.log("[storage:setup] created:", objectPath);
  }

  await bucket.setMetadata({ lifecycle: LIFECYCLE_RULES });
  console.log("[storage:setup] lifecycle applied — delete users/* after 30 days");

  const [metadata] = await bucket.getMetadata();
  console.log("[storage:setup] lifecycle rules:", JSON.stringify(metadata.lifecycle?.rule || [], null, 2));
  console.log("[storage:setup] done");
}

main().catch((err) => {
  console.error("[storage:setup] failed:", err.message || err);
  process.exit(1);
});
