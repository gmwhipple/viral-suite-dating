#!/usr/bin/env node
/**
 * Add Firebase Auth email DNS records to signatureswipe.com on Cloudflare.
 *
 * Requires CLOUDFLARE_API_TOKEN with Zone → DNS → Edit for signatureswipe.com.
 * Create at: https://dash.cloudflare.com/profile/api-tokens (template: Edit zone DNS)
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=xxx node scripts/add-firebase-dns-cloudflare.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ZONE_NAME = "signatureswipe.com";

const RECORDS = [
  {
    type: "TXT",
    name: "signatureswipe.com",
    content: "v=spf1 include:_spf.firebasemail.com ~all",
  },
  {
    type: "TXT",
    name: "signatureswipe.com",
    content: "firebase=dating-profile-ai",
  },
  {
    type: "CNAME",
    name: "firebase1._domainkey.signatureswipe.com",
    content: "mail-signatureswipe-com.dkim1._domainkey.firebasemail.com",
    proxied: false,
  },
  {
    type: "CNAME",
    name: "firebase2._domainkey.signatureswipe.com",
    content: "mail-signatureswipe-com.dkim2._domainkey.firebasemail.com",
    proxied: false,
  },
];

function loadToken() {
  if (process.env.CLOUDFLARE_API_TOKEN?.trim()) {
    return process.env.CLOUDFLARE_API_TOKEN.trim();
  }
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, "utf8")
    .split("\n")
    .find((l) => l.startsWith("CLOUDFLARE_API_TOKEN="));
  if (!line) return null;
  return line.slice("CLOUDFLARE_API_TOKEN=".length).trim().replace(/^["']|["']$/g, "");
}

async function cf(path, token, options = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(msg);
  }
  return json;
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error(
      "Missing CLOUDFLARE_API_TOKEN. Add to .env or env with Zone DNS Edit permission."
    );
    process.exit(1);
  }

  const zones = await cf(`/zones?name=${ZONE_NAME}`, token);
  const zone = zones.result?.[0];
  if (!zone) throw new Error(`Zone not found: ${ZONE_NAME}`);

  console.log(`Zone: ${zone.name} (${zone.id})`);

  const existing = await cf(
    `/zones/${zone.id}/dns_records?per_page=100`,
    token
  );

  for (const record of RECORDS) {
    const match = existing.result.find(
      (r) =>
        r.type === record.type &&
        r.name === record.name &&
        (record.type === "TXT" ? r.content === record.content : true)
    );

    if (match && record.type === "TXT" && match.content === record.content) {
      console.log(`skip (exists): ${record.type} ${record.name} = ${record.content}`);
      continue;
    }

    if (match && record.type === "CNAME") {
      if (match.content === record.content) {
        console.log(`skip (exists): CNAME ${record.name} -> ${record.content}`);
        continue;
      }
      await cf(`/zones/${zone.id}/dns_records/${match.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({
          content: record.content,
          proxied: record.proxied ?? false,
        }),
      });
      console.log(`updated: CNAME ${record.name} -> ${record.content}`);
      continue;
    }

    const body = {
      type: record.type,
      name: record.name,
      content: record.content,
      ttl: 1,
      ...(record.type === "CNAME" ? { proxied: record.proxied ?? false } : {}),
    };

    await cf(`/zones/${zone.id}/dns_records`, token, {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(`created: ${record.type} ${record.name} = ${record.content}`);
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
