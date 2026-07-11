import { DEFAULT_LOCALE } from "./index";

const LOCALE_OVERRIDE_KEY = "vs_locale";

/** BCP-47 tags we ship — used to validate manual overrides. */
export const SUPPORTED_LOCALE_TAGS = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "nl",
  "pl",
  "ru",
  "ja",
  "ko",
  "zh",
  "zh-TW",
  "ar",
  "hi",
  "tr",
  "vi",
  "th",
  "id",
  "sv",
  "da",
  "nb",
  "fi",
  "cs",
  "hu",
  "ro",
  "el",
  "he",
  "uk",
  "ms",
  "fil",
  "bn",
  "ur",
  "fa",
  "af",
  "ca",
  "sk",
  "hr",
  "bg",
  "sr",
  "sl",
  "lt",
  "lv",
  "et",
  "sw",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALE_TAGS)[number];

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

/** Locales that read right-to-left. */
export function isRtlLocale(locale: string): boolean {
  const base = locale.split("-")[0].toLowerCase();
  return RTL_LOCALES.has(base) || locale.toLowerCase() === "ur";
}

/**
 * Parse an Accept-Language header (or any comma-separated tag list) into
 * preference-ordered BCP-47 tags. Quality values are respected.
 */
export function parseLanguageTags(header: string | null | undefined): string[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      let q = 1;
      for (const param of params) {
        const match = param.trim().match(/^q=(\d+(?:\.\d+)?)$/i);
        if (match) q = Number(match[1]);
      }
      return { tag: tag.trim(), q };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

/** Map a BCP-47 tag to a registered locale key (`en-US` → `en`, `pt-BR` → `pt`). */
export function normalizeLocaleTag(tag: string): string | null {
  if (!tag) return null;
  const lower = tag.toLowerCase();

  for (const supported of SUPPORTED_LOCALE_TAGS) {
    if (lower === supported.toLowerCase()) return supported;
  }

  const base = lower.split("-")[0];
  for (const supported of SUPPORTED_LOCALE_TAGS) {
    if (supported.toLowerCase() === base) return supported;
  }

  // Common aliases
  if (base === "no") return "nb";
  if (base === "tl") return "fil";
  if (lower === "zh-hant" || lower === "zh-tw" || lower === "zh-hk") return "zh-TW";
  if (lower === "zh-hans" || lower === "zh-cn") return "zh";

  return null;
}

/** Pick the best registered locale from an ordered tag list. */
export function pickLocale(languageTags: readonly string[]): string {
  for (const tag of languageTags) {
    const normalized = normalizeLocaleTag(tag);
    if (normalized) return normalized;
  }
  return DEFAULT_LOCALE;
}

/** Read `?lang=` from the current URL (client only). */
export function getLocaleFromSearchParams(): string | null {
  if (typeof window === "undefined") return null;
  const lang = new URLSearchParams(window.location.search).get("lang");
  if (!lang) return null;
  return normalizeLocaleTag(lang);
}

/** Persist a manual locale choice (client only). */
export function persistLocaleChoice(locale: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_OVERRIDE_KEY, locale);
  } catch {
    // private browsing / quota — ignore
  }
}

/** Read a previously saved locale override (client only). */
export function readPersistedLocale(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_OVERRIDE_KEY);
    if (!stored) return null;
    return normalizeLocaleTag(stored);
  } catch {
    return null;
  }
}

/**
 * Client-side locale resolution priority:
 *   1. `?lang=` query param (also persisted)
 *   2. localStorage override
 *   3. `navigator.languages` / `navigator.language` (reflects OS language on all modern browsers)
 */
export function detectClientLocale(): string {
  const fromQuery = getLocaleFromSearchParams();
  if (fromQuery) {
    persistLocaleChoice(fromQuery);
    return fromQuery;
  }

  const persisted = readPersistedLocale();
  if (persisted) return persisted;

  const browserTags =
    typeof navigator !== "undefined"
      ? navigator.languages?.length
        ? [...navigator.languages]
        : navigator.language
          ? [navigator.language]
          : []
      : [];

  return pickLocale(browserTags);
}

/** Server-side locale from the Accept-Language header (set by the browser from OS prefs). */
export function detectServerLocale(acceptLanguage: string | null | undefined): string {
  return pickLocale(parseLanguageTags(acceptLanguage));
}
