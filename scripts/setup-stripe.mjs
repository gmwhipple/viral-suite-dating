/**
 * Creates the Stripe product + optional fixed price in your sandbox/live account.
 * Usage: node scripts/setup-stripe.mjs
 *
 * Requires STRIPE_SECRET_KEY or STRIPE_SANDBOX_SECRET in .env (loaded via dotenv not included — export manually or use):
 *   export $(grep -E '^STRIPE_' .env | xargs) && node scripts/setup-stripe.mjs
 */

const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SANDBOX_SECRET;

if (!key) {
  console.error("Set STRIPE_SECRET_KEY or STRIPE_SANDBOX_SECRET");
  process.exit(1);
}

const BASE = "https://api.stripe.com/v1";

async function stripePost(path, params) {
  const body = new URLSearchParams(params);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || JSON.stringify(json));
  }
  return json;
}

async function main() {
  console.log("Creating Stripe product…");
  const product = await stripePost("/products", {
    name: "Profile Makeover Pro",
    description: "100 AI dating photos + unlimited edits",
    "metadata[app]": "viral-suite-dating",
  });

  console.log("Creating USD $199 price (Tier 1 reference)…");
  const price = await stripePost("/prices", {
    product: product.id,
    currency: "usd",
    unit_amount: "19900",
  });

  console.log("\n✓ Stripe setup complete\n");
  console.log("Product ID:", product.id);
  console.log("Price ID (optional — app uses dynamic pricing if unset):", price.id);
  console.log("\nAdd to .env:");
  console.log(`STRIPE_PRICE_ID=${price.id}`);
  console.log("\nWebhook (required for payments to unlock):");
  console.log("1. Stripe Dashboard → Developers → Webhooks → Add endpoint");
  console.log("   URL: https://YOUR-DOMAIN/api/stripe/webhook");
  console.log("   Events: checkout.session.completed");
  console.log("2. Copy signing secret → STRIPE_WEBHOOK_SECRET=whsec_...");
  console.log("\nLocal testing:");
  console.log("  brew install stripe/stripe-cli/stripe");
  console.log("  stripe listen --forward-to localhost:3000/api/stripe/webhook");
  console.log("\nPricing tiers (handled in app):");
  console.log("  Tier 1: $199 | Tier 2: $149 (75%) | Tier 3: $119 (60%)");
  console.log("  Blocked: IN, BD, PK, NG, and others — see src/lib/stripe-pricing.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
