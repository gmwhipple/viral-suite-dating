import Stripe from "stripe";
import { MAX_GENERATIONS_PER_USER, MAX_EDITS_PER_USER, PRICING } from "@/lib/constants";
import { getLocalizedPrice, type LocalizedPrice } from "@/lib/stripe-pricing";
import { mapLocaleToStripe } from "@/lib/stripe-locale";

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
  userId?: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  countryCode: string | null;
  localizedPrice: LocalizedPrice;
  locale?: string;
  metaAttribution?: {
    fbc?: string;
    fbp?: string;
    clientIp?: string;
    clientUserAgent?: string;
    sourceUrl?: string;
    checkoutEventId?: string;
    externalId?: string;
  };
}) {
  const { localizedPrice } = params;
  const metadata: Record<string, string> = {
    product: "profile-makeover-pro",
    generationsLimit: String(MAX_GENERATIONS_PER_USER),
    editsLimit: String(MAX_EDITS_PER_USER),
    pricingTier: localizedPrice.tier,
    priceUsd: String(localizedPrice.amountUsd),
    countryCode: params.countryCode || "unknown",
    checkoutLocale: params.locale || "en",
  };

  if (params.metaAttribution?.fbc) metadata.metaFbc = params.metaAttribution.fbc;
  if (params.metaAttribution?.fbp) metadata.metaFbp = params.metaAttribution.fbp;
  if (params.metaAttribution?.clientIp) metadata.metaClientIp = params.metaAttribution.clientIp;
  if (params.metaAttribution?.clientUserAgent) {
    metadata.metaClientUserAgent = params.metaAttribution.clientUserAgent;
  }
  if (params.metaAttribution?.sourceUrl) metadata.metaSourceUrl = params.metaAttribution.sourceUrl;
  if (params.metaAttribution?.checkoutEventId) {
    metadata.metaCheckoutEventId = params.metaAttribution.checkoutEventId;
  }
  if (params.metaAttribution?.externalId) metadata.metaExternalId = params.metaAttribution.externalId;

  if (params.userId) {
    metadata.userId = params.userId;
  } else {
    metadata.guestCheckout = "true";
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: mapLocaleToStripe(params.locale || "en"),
    customer_creation: "always",
    ...(params.email ? { customer_email: params.email } : {}),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: localizedPrice.currency,
          unit_amount: localizedPrice.amountMinor,
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
    metadata,
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
