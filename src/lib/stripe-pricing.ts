import {
  estimateUsdEquivalent,
  formatPrice,
  getCurrencyForCountry,
  getPhotographerAmount,
  getProductAmounts,
  resolvePricingCountry,
  toStripeMinorUnit,
  type PricingTier,
} from "./stripe-currencies";

/** Base list price in USD (Tier 1). */
export const BASE_PRICE_USD = 199;

export type { PricingTier };

export interface LocalizedPrice {
  tier: PricingTier;
  currency: string;
  amount: number;
  amountMinor: number;
  amountUsd: number;
  label: string;
  multiplier: number;
}

/** Payments blocked — high fraud / support risk markets. Edit as needed. */
export const BLOCKED_CHECKOUT_COUNTRIES = new Set([
  "IN",
  "BD",
  "PK",
  "NG",
  "GH",
  "KE",
  "PH",
  "ID",
  "VN",
  "LK",
  "MM",
  "NP",
  "UZ",
  "KH",
  "ET",
  "TZ",
  "UG",
  "ZW",
  "AO",
  "CM",
  "CI",
  "SN",
  "ML",
  "BF",
  "IQ",
  "AF",
  "SY",
  "YE",
  "IR",
  "KP",
  "CU",
]);

/** Full price — US, UK, CA, AU, Western Europe, Gulf, etc. */
const TIER1_COUNTRIES = new Set([
  "US", "CA", "GB", "AU", "NZ", "CH", "NO", "SE", "DK", "IE", "NL", "BE", "LU", "AT", "DE", "FR",
  "IT", "ES", "PT", "FI", "IS", "SG", "HK", "JP", "KR", "AE", "SA", "QA", "KW", "BH", "OM", "IL",
  "HU",
  "CY", "MT", "MC", "LI", "AD", "SM", "PM", "GG", "JE", "IM", "GI", "BM", "KY", "VG", "TC", "MS",
  "AI", "GF", "GP", "MQ", "RE", "YT", "NC", "PF", "WF", "BL", "MF", "PR", "GU", "AS", "VI",
]);

/** 75% of base — Eastern EU, Latin America, mid-income Asia, etc. */
const TIER2_COUNTRIES = new Set([
  "PL", "CZ", "SK", "RO", "BG", "HR", "SI", "EE", "LV", "LT", "GR", "RS", "BA", "MK", "AL",
  "ME", "MD", "TR", "MX", "BR", "AR", "CL", "CO", "PE", "UY", "CR", "PA", "DO", "EC", "GT", "HN",
  "PY", "BO", "SV", "NI", "ZA", "TW", "MY", "TH", "CN", "RU", "BY", "KZ", "AM", "GE", "AZ", "UA",
  "JO", "LB", "MA", "TN", "DZ", "EG", "MU", "SC", "MV", "FJ", "BN", "MO", "MN", "KZ",
]);

export const TIER_MULTIPLIERS: Record<PricingTier, number> = {
  tier1: 1,
  tier2: 0.75,
  tier3: 0.6,
};

/** Round to psychologically clean USD price (…9 endings). */
export function roundMarketingUsd(raw: number): number {
  if (raw >= 150) return Math.round(raw / 10) * 10 - 1;
  if (raw >= 80) return Math.round(raw / 10) * 10 - 1;
  return Math.max(9, Math.round(raw / 5) * 5 - 1);
}

/** Geo wins for currency/tier; locale country is only used when geo is unknown (localhost). */
export function preferLocalePricing(
  geoCountry: string | null | undefined,
  hasLocaleHint: boolean
): boolean {
  return !geoCountry && hasLocaleHint;
}

export function getPricingTier(countryCode: string | null | undefined): PricingTier {
  if (!countryCode) return "tier1";
  const code = countryCode.toUpperCase();
  if (TIER1_COUNTRIES.has(code)) return "tier1";
  if (TIER2_COUNTRIES.has(code)) return "tier2";
  return "tier3";
}

export function isCheckoutBlocked(countryCode: string | null | undefined): boolean {
  if (!countryCode) return false;
  return BLOCKED_CHECKOUT_COUNTRIES.has(countryCode.toUpperCase());
}

export function getLocalizedPrice(
  countryCode: string | null | undefined,
  locale = "en",
  options?: { preferLocale?: boolean }
): LocalizedPrice {
  const pricingCountry = resolvePricingCountry(countryCode, locale, options?.preferLocale);
  const tier = getPricingTier(pricingCountry);
  const currency = getCurrencyForCountry(pricingCountry);
  const amounts = getProductAmounts(currency);
  const amount = amounts[tier];
  const multiplier = TIER_MULTIPLIERS[tier];

  return {
    tier,
    currency,
    amount,
    amountMinor: toStripeMinorUnit(amount, currency),
    amountUsd: estimateUsdEquivalent(amount, currency),
    label: formatPrice(amount, currency, locale),
    multiplier,
  };
}

export function getLocalizedPhotographerPrice(
  countryCode: string | null | undefined,
  locale = "en",
  options?: { preferLocale?: boolean }
): { amount: number; label: string; amountUsd: number } {
  const pricingCountry = resolvePricingCountry(countryCode, locale, options?.preferLocale);
  const tier = getPricingTier(pricingCountry);
  const currency = getCurrencyForCountry(pricingCountry);
  const amount = getPhotographerAmount(currency, tier);

  return {
    amount,
    label: formatPrice(amount, currency, locale),
    amountUsd: estimateUsdEquivalent(amount, currency),
  };
}

export const TIER_PRICES_USD: Record<PricingTier, number> = {
  tier1: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier1),
  tier2: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier2),
  tier3: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier3),
};
