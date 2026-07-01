import Stripe from "stripe";
import { MAX_GENERATIONS_PER_USER, PRICING } from "@/lib/constants";
import { getLocalizedPrice, type LocalizedPrice } from "@/lib/stripe-pricing";

let stripe: Stripe | null = null;

export function getStripeSecretKey(): string | undefined {
  return (
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.STRIPE_SANDBOX_SECRET?.trim() ||
    undefined
  );
}

export function getStripe(): Stripe {
  if (!stripe) {
    const key = getStripeSecretKey();
    if (!key) throw new Error("STRIPE_SECRET_KEY or STRIPE_SANDBOX_SECRET not configured");
    stripe = new Stripe(key);
  }
  return stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripeSecretKey());
}

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  countryCode: string | null;
  localizedPrice: LocalizedPrice;
}) {
  const { localizedPrice } = params;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: params.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: localizedPrice.amountCents,
          product_data: {
            name: PRICING.name,
            description: PRICING.description,
            metadata: {
              pricingTier: localizedPrice.tier,
            },
          },
        },
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    billing_address_collection: "required",
    metadata: {
      userId: params.userId,
      product: "profile-makeover-pro",
      generationsLimit: String(MAX_GENERATIONS_PER_USER),
      pricingTier: localizedPrice.tier,
      priceUsd: String(localizedPrice.amountUsd),
      countryCode: params.countryCode || "unknown",
    },
  });

  return session;
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
