import { formatPrice } from "@/lib/stripe-currencies";
import {
  getLocalizedPhotographerPrice,
  getLocalizedPrice,
  type PricingTier,
} from "@/lib/stripe-pricing";

export interface DisplayPrices {
  tier: PricingTier;
  currency: string;
  productAmount: number;
  photographerAmount: number;
  productLabel: string;
  photographerLabel: string;
}

export function buildDisplayPrices(params: {
  tier: PricingTier;
  currency: string;
  productAmount: number;
  photographerAmount: number;
  locale: string;
}): DisplayPrices {
  const { tier, currency, productAmount, photographerAmount, locale } = params;

  return {
    tier,
    currency,
    productAmount,
    photographerAmount,
    productLabel: formatPrice(productAmount, currency, locale),
    photographerLabel: formatPrice(photographerAmount, currency, locale),
  };
}

/** Fallback when geo is unknown (offline). Prefer `/api/stripe/pricing` on the client. */
export function getDisplayPricesForLocale(locale: string): DisplayPrices {
  const product = getLocalizedPrice(null, locale, { preferLocale: true });
  const photographer = getLocalizedPhotographerPrice(null, locale, { preferLocale: true });

  return buildDisplayPrices({
    tier: product.tier,
    currency: product.currency,
    productAmount: product.amount,
    photographerAmount: photographer.amount,
    locale,
  });
}
