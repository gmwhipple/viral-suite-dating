/** Base list price in USD (Tier 1). */
export const BASE_PRICE_USD = 199;

export type PricingTier = "tier1" | "tier2" | "tier3";

export interface LocalizedPrice {
  tier: PricingTier;
  amountUsd: number;
  amountCents: number;
  label: string;
  multiplier: number;
}

/** Payments blocked — high fraud / support risk markets. Edit as needed. */
export const BLOCKED_CHECKOUT_COUNTRIES = new Set([
  "IN", // India
  "BD", // Bangladesh
  "PK", // Pakistan
  "NG", // Nigeria
  "GH", // Ghana
  "KE", // Kenya
  "PH", // Philippines
  "ID", // Indonesia
  "VN", // Vietnam
  "LK", // Sri Lanka
  "MM", // Myanmar
  "NP", // Nepal
  "UZ", // Uzbekistan
  "KH", // Cambodia
  "ET", // Ethiopia
  "TZ", // Tanzania
  "UG", // Uganda
  "ZW", // Zimbabwe
  "AO", // Angola
  "CM", // Cameroon
  "CI", // Côte d'Ivoire
  "SN", // Senegal
  "ML", // Mali
  "BF", // Burkina Faso
  "IQ", // Iraq
  "AF", // Afghanistan
  "SY", // Syria
  "YE", // Yemen
  "IR", // Iran
  "KP", // North Korea
  "CU", // Cuba
]);

/** Full price — US, UK, CA, AU, Western Europe, Gulf, etc. */
const TIER1_COUNTRIES = new Set([
  "US", "CA", "GB", "AU", "NZ", "CH", "NO", "SE", "DK", "IE", "NL", "BE", "LU", "AT", "DE", "FR",
  "IT", "ES", "PT", "FI", "IS", "SG", "HK", "JP", "KR", "AE", "SA", "QA", "KW", "BH", "OM", "IL",
  "CY", "MT", "MC", "LI", "AD", "SM", "PM", "GG", "JE", "IM", "GI", "BM", "KY", "VG", "TC", "MS",
  "AI", "GF", "GP", "MQ", "RE", "YT", "NC", "PF", "WF", "BL", "MF", "PR", "GU", "AS", "VI",
]);

/** 75% of base — Eastern EU, Latin America, mid-income Asia, etc. */
const TIER2_COUNTRIES = new Set([
  "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV", "LT", "GR", "RS", "BA", "MK", "AL",
  "ME", "MD", "TR", "MX", "BR", "AR", "CL", "CO", "PE", "UY", "CR", "PA", "DO", "EC", "GT", "HN",
  "PY", "BO", "SV", "NI", "ZA", "TW", "MY", "TH", "CN", "RU", "BY", "KZ", "AM", "GE", "AZ", "UA",
  "JO", "LB", "MA", "TN", "DZ", "EG", "MU", "SC", "MV", "FJ", "BN", "MO", "MN", "KZ",
]);

const TIER_MULTIPLIERS: Record<PricingTier, number> = {
  tier1: 1,
  tier2: 0.75,
  tier3: 0.6,
};

/** Round to psychologically clean USD price (…9 endings). */
export function roundMarketingUsd(raw: number): number {
  if (raw >= 150) return Math.round(raw / 10) * 10 - 1; // 149, 179, 199
  if (raw >= 80) return Math.round(raw / 10) * 10 - 1; // 119, 129
  return Math.max(9, Math.round(raw / 5) * 5 - 1);
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

export function getLocalizedPrice(countryCode: string | null | undefined): LocalizedPrice {
  const tier = getPricingTier(countryCode);
  const multiplier = TIER_MULTIPLIERS[tier];
  const amountUsd = roundMarketingUsd(BASE_PRICE_USD * multiplier);

  return {
    tier,
    amountUsd,
    amountCents: amountUsd * 100,
    label: `$${amountUsd}`,
    multiplier,
  };
}

export const TIER_PRICES_USD: Record<PricingTier, number> = {
  tier1: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier1),
  tier2: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier2),
  tier3: roundMarketingUsd(BASE_PRICE_USD * TIER_MULTIPLIERS.tier3),
};
