import { en, type Dictionary } from "./translations/en";
import { SUPPORTED_LOCALE_TAGS } from "./locale-detection";

export type { Dictionary };
export { SUPPORTED_LOCALE_TAGS };

export const DEFAULT_LOCALE = "en";

/**
 * Registered locales. The active locale is resolved from:
 *   - `?lang=` query param (persisted)
 *   - localStorage override
 *   - `navigator.languages` (browser/OS language on all modern devices)
 *   - `Accept-Language` header on the server
 */
const LOCALE_LOADERS: Record<string, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  es: () => import("./translations/es").then((m) => m.es),
  fr: () => import("./translations/fr").then((m) => m.fr),
  de: () => import("./translations/de").then((m) => m.de),
  it: () => import("./translations/it").then((m) => m.it),
  pt: () => import("./translations/pt").then((m) => m.pt),
  nl: () => import("./translations/nl").then((m) => m.nl),
  pl: () => import("./translations/pl").then((m) => m.pl),
  ru: () => import("./translations/ru").then((m) => m.ru),
  ja: () => import("./translations/ja").then((m) => m.ja),
  ko: () => import("./translations/ko").then((m) => m.ko),
  zh: () => import("./translations/zh").then((m) => m.zh),
  "zh-TW": () => import("./translations/zh-TW").then((m) => m.zhTW),
  ar: () => import("./translations/ar").then((m) => m.ar),
  hi: () => import("./translations/hi").then((m) => m.hi),
  tr: () => import("./translations/tr").then((m) => m.tr),
  vi: () => import("./translations/vi").then((m) => m.vi),
  th: () => import("./translations/th").then((m) => m.th),
  id: () => import("./translations/id").then((m) => m.id),
  sv: () => import("./translations/sv").then((m) => m.sv),
  da: () => import("./translations/da").then((m) => m.da),
  nb: () => import("./translations/nb").then((m) => m.nb),
  fi: () => import("./translations/fi").then((m) => m.fi),
  cs: () => import("./translations/cs").then((m) => m.cs),
  hu: () => import("./translations/hu").then((m) => m.hu),
  ro: () => import("./translations/ro").then((m) => m.ro),
  el: () => import("./translations/el").then((m) => m.el),
  he: () => import("./translations/he").then((m) => m.he),
  uk: () => import("./translations/uk").then((m) => m.uk),
  ms: () => import("./translations/ms").then((m) => m.ms),
  fil: () => import("./translations/fil").then((m) => m.fil),
  bn: () => import("./translations/bn").then((m) => m.bn),
  ur: () => import("./translations/ur").then((m) => m.ur),
  fa: () => import("./translations/fa").then((m) => m.fa),
  af: () => import("./translations/af").then((m) => m.af),
  ca: () => import("./translations/ca").then((m) => m.ca),
  sk: () => import("./translations/sk").then((m) => m.sk),
  hr: () => import("./translations/hr").then((m) => m.hr),
  bg: () => import("./translations/bg").then((m) => m.bg),
  sr: () => import("./translations/sr").then((m) => m.sr),
  sl: () => import("./translations/sl").then((m) => m.sl),
  lt: () => import("./translations/lt").then((m) => m.lt),
  lv: () => import("./translations/lv").then((m) => m.lv),
  et: () => import("./translations/et").then((m) => m.et),
  sw: () => import("./translations/sw").then((m) => m.sw),
};

/** Normalize a BCP-47 tag ("en-US" → "en") to a registered locale key. */
export function resolveLocale(languageTags: readonly string[]): string {
  for (const tag of languageTags) {
    if (!tag) continue;
    const exact = tag.toLowerCase();
    if (LOCALE_LOADERS[exact]) return exact;
    const base = exact.split("-")[0];
    if (LOCALE_LOADERS[base]) return base;
    if (exact === "zh-tw" || exact === "zh-hant" || exact === "zh-hk") return "zh-TW";
    if (exact === "zh-cn" || exact === "zh-hans") return "zh";
    if (base === "no") return "nb";
    if (base === "tl") return "fil";
  }
  return DEFAULT_LOCALE;
}

export async function loadDictionary(locale: string): Promise<Dictionary> {
  const loader = LOCALE_LOADERS[locale] ?? LOCALE_LOADERS[DEFAULT_LOCALE];
  return loader();
}

/** Synchronous default dictionary — used for SSR and as instant fallback. */
export function getDefaultDictionary(): Dictionary {
  return en;
}

/** Fill `{placeholder}` tokens in a translated string. */
export function format(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}
