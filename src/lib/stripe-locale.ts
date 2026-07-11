import type Stripe from "stripe";

/** Map our BCP-47 locale keys to Stripe Checkout `locale` values. */
const STRIPE_LOCALE_MAP: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  nl: "nl",
  pl: "pl",
  ru: "ru",
  ja: "ja",
  ko: "ko",
  zh: "zh",
  "zh-TW": "zh-TW",
  tr: "tr",
  vi: "vi",
  th: "th",
  id: "id",
  sv: "sv",
  da: "da",
  nb: "nb",
  fi: "fi",
  cs: "cs",
  hu: "hu",
  ro: "ro",
  el: "el",
  ms: "ms",
  sk: "sk",
  hr: "hr",
  bg: "bg",
  sl: "sl",
  lt: "lt",
  lv: "lv",
  et: "et",
};

export function mapLocaleToStripe(locale: string): Stripe.Checkout.SessionCreateParams.Locale {
  const direct = STRIPE_LOCALE_MAP[locale];
  if (direct) return direct;

  const base = locale.split("-")[0].toLowerCase();
  const fromBase = STRIPE_LOCALE_MAP[base];
  if (fromBase) return fromBase;

  return "auto";
}
