export type PricingTier = "tier1" | "tier2" | "tier3";

const BASE_PRICE_USD = 199;

/** Stripe charges in the smallest currency unit (cents), except zero-decimal currencies. */
export const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

/**
 * Stripe-style localized list prices per currency and tier.
 * Tier multipliers match checkout: tier1 100%, tier2 75%, tier3 60%.
 */
export const PRODUCT_AMOUNTS: Record<string, Record<PricingTier, number>> = {
  usd: { tier1: 199, tier2: 149, tier3: 119 },
  eur: { tier1: 179, tier2: 134, tier3: 107 },
  gbp: { tier1: 149, tier2: 109, tier3: 89 },
  cad: { tier1: 269, tier2: 199, tier3: 159 },
  aud: { tier1: 299, tier2: 219, tier3: 179 },
  nzd: { tier1: 329, tier2: 249, tier3: 199 },
  chf: { tier1: 169, tier2: 129, tier3: 99 },
  sek: { tier1: 2099, tier2: 1549, tier3: 1249 },
  nok: { tier1: 2199, tier2: 1649, tier3: 1299 },
  dkk: { tier1: 1399, tier2: 1049, tier3: 839 },
  pln: { tier1: 799, tier2: 599, tier3: 479 },
  czk: { tier1: 4499, tier2: 3399, tier3: 2699 },
  huf: { tier1: 39999, tier2: 29999, tier3: 23999 },
  ron: { tier1: 899, tier2: 679, tier3: 539 },
  rub: { tier1: 17999, tier2: 13499, tier3: 10799 },
  jpy: { tier1: 29800, tier2: 22400, tier3: 17800 },
  krw: { tier1: 269000, tier2: 199000, tier3: 159000 },
  sgd: { tier1: 269, tier2: 199, tier3: 159 },
  hkd: { tier1: 1549, tier2: 1149, tier3: 929 },
  mxn: { tier1: 3499, tier2: 2599, tier3: 2099 },
  brl: { tier1: 999, tier2: 749, tier3: 599 },
  try: { tier1: 6499, tier2: 4899, tier3: 3899 },
  thb: { tier1: 6999, tier2: 5199, tier3: 4199 },
  inr: { tier1: 16999, tier2: 12799, tier3: 10199 },
  zar: { tier1: 3699, tier2: 2749, tier3: 2199 },
  ils: { tier1: 749, tier2: 559, tier3: 449 },
  aed: { tier1: 729, tier2: 549, tier3: 439 },
  sar: { tier1: 749, tier2: 559, tier3: 449 },
  twd: { tier1: 6299, tier2: 4699, tier3: 3799 },
  myr: { tier1: 899, tier2: 679, tier3: 539 },
  php: { tier1: 11499, tier2: 8599, tier3: 6899 },
  idr: { tier1: 3199000, tier2: 2399000, tier3: 1919000 },
  vnd: { tier1: 4999000, tier2: 3749000, tier3: 2999000 },
  cny: { tier1: 1399, tier2: 1049, tier3: 839 },
};

const EURO_ZONE = new Set([
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "IE", "IT", "LT", "LU", "LV", "MT",
  "NL", "PT", "SI", "SK", "HR", "AD", "MC", "SM", "PM", "GF", "GP", "MQ", "RE", "YT", "NC",
  "PF", "WF", "BL", "MF",
]);

/** ISO country → Stripe checkout currency. */
const COUNTRY_CURRENCY: Record<string, string> = {
  US: "usd",
  CA: "cad",
  GB: "gbp",
  AU: "aud",
  NZ: "nzd",
  CH: "chf",
  SE: "sek",
  NO: "nok",
  DK: "dkk",
  PL: "pln",
  CZ: "czk",
  HU: "huf",
  RO: "ron",
  JP: "jpy",
  KR: "krw",
  SG: "sgd",
  HK: "hkd",
  MX: "mxn",
  BR: "brl",
  TR: "try",
  TH: "thb",
  IN: "inr",
  ZA: "zar",
  IL: "ils",
  AE: "aed",
  SA: "sar",
  TW: "twd",
  MY: "myr",
  PH: "php",
  ID: "idr",
  VN: "vnd",
  AR: "usd",
  CL: "usd",
  CO: "usd",
  PE: "usd",
  UY: "usd",
  CR: "usd",
  PA: "usd",
  DO: "usd",
  EC: "usd",
  GT: "usd",
  HN: "usd",
  PY: "usd",
  BO: "usd",
  SV: "usd",
  NI: "usd",
  RU: "rub",
  UA: "usd",
  BY: "usd",
  KZ: "usd",
  AM: "usd",
  GE: "usd",
  AZ: "usd",
  JO: "usd",
  LB: "usd",
  MA: "usd",
  TN: "usd",
  DZ: "usd",
  EG: "usd",
  MU: "usd",
  SC: "usd",
  MV: "usd",
  FJ: "usd",
  BN: "usd",
  MO: "usd",
  MN: "usd",
  CN: "cny",
  RS: "eur",
  BA: "eur",
  MK: "eur",
  AL: "eur",
  ME: "eur",
  MD: "eur",
  BG: "eur",
  IS: "usd",
  LI: "chf",
  GG: "gbp",
  JE: "gbp",
  IM: "gbp",
  GI: "gbp",
  BM: "usd",
  KY: "usd",
  VG: "usd",
  TC: "usd",
  MS: "usd",
  AI: "usd",
  PR: "usd",
  GU: "usd",
  AS: "usd",
  VI: "usd",
  QA: "usd",
  KW: "usd",
  BH: "usd",
  OM: "usd",
};

/**
 * Representative billing country per UI locale — used when CDN geo headers are absent
 * (localhost) and to match displayed prices to the language the visitor selected.
 */
export const LOCALE_PRICING_COUNTRY: Record<string, string> = {
  en: "US",
  es: "MX",
  fr: "FR",
  de: "DE",
  it: "IT",
  pt: "BR",
  nl: "NL",
  pl: "PL",
  ru: "RU",
  ja: "JP",
  ko: "KR",
  zh: "CN",
  "zh-TW": "TW",
  ar: "SA",
  hi: "IN",
  tr: "TR",
  vi: "VN",
  th: "TH",
  id: "ID",
  sv: "SE",
  da: "DK",
  nb: "NO",
  fi: "FI",
  cs: "CZ",
  hu: "HU",
  ro: "RO",
  el: "GR",
  he: "IL",
  uk: "UA",
  ms: "MY",
  fil: "PH",
  bn: "BD",
  ur: "PK",
  fa: "IR",
  af: "ZA",
  ca: "ES",
  sk: "SK",
  hr: "HR",
  bg: "BG",
  sr: "RS",
  sl: "SI",
  lt: "LT",
  lv: "LV",
  et: "EE",
  sw: "KE",
};

export function getPricingCountryForLocale(locale: string | null | undefined): string {
  if (!locale) return "US";
  if (LOCALE_PRICING_COUNTRY[locale]) return LOCALE_PRICING_COUNTRY[locale];
  const base = locale.split("-")[0];
  return LOCALE_PRICING_COUNTRY[base] ?? "US";
}

/** Geo wins at checkout; locale country is fallback when geo headers are absent. */
export function resolvePricingCountry(
  geoCountry: string | null | undefined,
  locale: string | null | undefined,
  preferLocale = false
): string {
  if (preferLocale) return getPricingCountryForLocale(locale);
  return geoCountry ?? getPricingCountryForLocale(locale);
}

export function getCurrencyForCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return "usd";
  const code = countryCode.toUpperCase();
  if (COUNTRY_CURRENCY[code]) return COUNTRY_CURRENCY[code];
  if (EURO_ZONE.has(code)) return "eur";
  return "usd";
}

export function getProductAmounts(currency: string): Record<PricingTier, number> {
  return PRODUCT_AMOUNTS[currency] ?? PRODUCT_AMOUNTS.usd;
}

/** Photographer comparison baseline scales with product price in each currency. */
export function getPhotographerAmount(currency: string, tier: PricingTier): number {
  const product = getProductAmounts(currency);
  const tier1Photographer = Math.round(product.tier1 * (400 / BASE_PRICE_USD));
  return Math.round(tier1Photographer * getTierMultiplier(tier));
}

function getTierMultiplier(tier: PricingTier): number {
  if (tier === "tier2") return 0.75;
  if (tier === "tier3") return 0.6;
  return 1;
}

/** Approximate USD equivalent for analytics metadata. */
export function estimateUsdEquivalent(amount: number, currency: string): number {
  const tier1 = getProductAmounts(currency).tier1;
  return Math.round((amount / tier1) * BASE_PRICE_USD);
}

export function toStripeMinorUnit(amountMajor: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) return amountMajor;
  return Math.round(amountMajor * 100);
}

export function formatPrice(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
