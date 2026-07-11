/**
 * Creates (or reuses) the live Stripe webhook for Signature Swipe.
 *
 * 1. Paste sk_live_... into STRIPE_SECRET_KEY in .env
 * 2. Run: npm run stripe:webhook
 *
 * Writes STRIPE_WEBHOOK_SECRET into .env automatically.
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) return;
  const text = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of text.split("\n")) {
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
    // Later lines win (live keys below test keys in .env)
    process.env[key] = value;
  }
}

function upsertEnvVar(key, value) {
  let lines = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8").split("\n") : [];
  lines = lines.filter((line) => !line.trim().startsWith(`${key}=`));
  lines.push(`${key}=${value}`);
  fs.writeFileSync(ENV_PATH, lines.join("\n"));
}

loadEnvFile();

const key = process.env.STRIPE_SECRET_KEY?.trim();

if (!key || key.includes("xxxx") || key.startsWith("sk_test_")) {
  console.error(`
Stripe live secret key missing or still set to test/placeholder.

Where to find sk_live_:
  1. Open https://dashboard.stripe.com/apikeys
  2. Turn OFF "Test mode" (toggle top-right)
  3. Under "Standard keys" click Reveal on "Secret key"
  4. Copy sk_live_... into .env:

     STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE

Then run again: npm run stripe:webhook
`);
  process.exit(1);
}

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://signatureswipe.com").replace(
  /\/$/,
  ""
);
const webhookUrl = `${appUrl}/api/stripe/webhook`;
const BASE = "https://api.stripe.com/v1";

async function stripeRequest(method, path, params) {
  const init = {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
    },
  };

  if (params) {
    init.headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params);
  }

  const res = await fetch(`${BASE}${path}`, init);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || JSON.stringify(json));
  }
  return json;
}

async function main() {
  const mode = key.startsWith("sk_live_") ? "LIVE" : "TEST";
  console.log(`Stripe mode: ${mode}`);
  console.log(`Webhook URL: ${webhookUrl}`);

  const listed = await stripeRequest("GET", "/webhook_endpoints?limit=100");
  const existing = (listed.data || []).find((ep) => ep.url === webhookUrl);

  let signingSecret;

  if (existing) {
    console.log(`Webhook already exists (${existing.id}) — rolling signing secret…`);
    const rolled = await stripeRequest(
      "POST",
      `/webhook_endpoints/${existing.id}/secret`
    );
    signingSecret = rolled.secret;
  } else {
    console.log("Creating webhook endpoint…");
    const created = await stripeRequest("POST", "/webhook_endpoints", {
      url: webhookUrl,
      description: "Signature Swipe — checkout.session.completed",
      "enabled_events[0]": "checkout.session.completed",
    });
    signingSecret = created.secret;
    console.log(`Created webhook ${created.id}`);
  }

  if (!signingSecret || signingSecret.includes("xxxx")) {
    throw new Error("Stripe did not return a signing secret");
  }

  upsertEnvVar("STRIPE_WEBHOOK_SECRET", signingSecret);

  console.log("\n✓ Done — STRIPE_WEBHOOK_SECRET saved to .env");
  console.log("\nAlso add these to Replit → Deployments → Secrets:");
  console.log("  STRIPE_SECRET_KEY=(same sk_live_ key)");
  console.log(`  STRIPE_WEBHOOK_SECRET=${signingSecret}`);
  console.log(`  NEXT_PUBLIC_APP_URL=${appUrl}`);
  console.log("\nThen Publish on Replit.");
}

main().catch((err) => {
  console.error("Failed:", err.message || err);
  process.exit(1);
});
