import { DEFAULT_LOCALE } from "./index";
import { SUPPORTED_LOCALE_TAGS } from "./locale-detection";

/** Original US/English marquee — unchanged. */
const EN_APPS = [
  "Tinder",
  "Hinge",
  "Bumble",
  "OkCupid",
  "Match",
  "Badoo",
  "Raya",
  "The League",
] as const;

/**
 * Popular dating apps per localized market — shown in the landing trust marquee.
 * Brand names stay untranslated; lists are ordered by regional popularity.
 */
const DATING_APPS_BY_LOCALE: Record<string, readonly string[]> = {
  en: EN_APPS,
  es: ["Tinder", "Hinge", "Badoo", "Meetic", "Bumble", "happn", "Plenty of Fish"],
  fr: ["Tinder", "Hinge", "happn", "Meetic", "Bumble", "Fruitz", "AdopteUnMec"],
  de: ["Tinder", "Hinge", "Lovoo", "Parship", "Bumble", "ElitePartner", "OkCupid"],
  it: ["Tinder", "Hinge", "Badoo", "Meetic", "Bumble", "Lovoo", "happn"],
  pt: ["Tinder", "Hinge", "Badoo", "Bumble", "happn", "Inner Circle", "Par Perfeito"],
  nl: ["Tinder", "Hinge", "Bumble", "Lexa", "happn", "Badoo", "EliteSingles"],
  pl: ["Tinder", "Hinge", "Badoo", "Bumble", "Sympatia", "Randki", "OkCupid"],
  ru: ["Tinder", "Mamba", "Badoo", "Teamo", "LovePlanet", "Topface"],
  ja: ["Pairs", "Tapple", "Omiai", "with", "Tinder", "Dine"],
  ko: ["Amanda", "Noondate", "GLAM", "Tinder", "Bumble", "Sky People"],
  zh: ["Tantan", "Momo", "Soul", "iHappy", "Blued", "探探"],
  "zh-TW": ["Paktor", "Tinder", "Goodnight", "iPair", "SweetRing", "Between"],
  ar: ["Tinder", "Muzz", "Hawaya", "Badoo", "OkCupid", "Bumble"],
  hi: ["Tinder", "Hinge", "Bumble", "Aisle", "TrulyMadly", "OkCupid"],
  tr: ["Tinder", "Hinge", "Badoo", "Siberalem", "OkCupid", "happn", "Bumble"],
  vi: ["Tinder", "Badoo", "Zoosk", "iHappy", "Bumble", "OkCupid"],
  th: ["Tinder", "Badoo", "ThaiCupid", "Bumble", "OkCupid", "iHappy"],
  id: ["Tinder", "Bumble", "TanTan", "Badoo", "BeeTalk", "OkCupid"],
  sv: ["Tinder", "Hinge", "Bumble", "Happy Pancake", "happn", "Badoo", "Lexa"],
  da: ["Tinder", "Hinge", "Bumble", "Happn", "Badoo", "Dating.dk", "Match"],
  nb: ["Tinder", "Hinge", "Bumble", "Sukker", "happn", "Moteplassen", "Badoo"],
  fi: ["Tinder", "Hinge", "Bumble", "E-Kontakti", "happn", "Suomi24", "Badoo"],
  cs: ["Tinder", "Hinge", "Badoo", "Seznamka", "Bumble", "happn", "Lide.cz"],
  hu: ["Tinder", "Hinge", "Badoo", "Párci", "Bumble", "Randivonal", "happn"],
  ro: ["Tinder", "Hinge", "Badoo", "Sentimente", "Bumble", "OkCupid", "Facebook Dating"],
  el: ["Tinder", "Hinge", "Badoo", "Bumble", "POF", "OkCupid", "EligibleGreeks"],
  he: ["Tinder", "OkCupid", "JSwipe", "Bumble", "Dates", "Muzz"],
  uk: ["Tinder", "Badoo", "Mamba", "Bumble", "Teamo", "Topface"],
  ms: ["Tinder", "Hinge", "Bumble", "TanTan", "Badoo", "OkCupid", "Muzmatch"],
  fil: ["Tinder", "Hinge", "Bumble", "OkCupid", "FilipinoCupid", "PinaLove", "Muzz"],
  bn: ["Tinder", "Badoo", "Bumble", "Mingle2", "OkCupid", "Muzz"],
  ur: ["Muzz", "Tinder", "Badoo", "Hawaya", "Dil Mil", "OkCupid"],
  fa: ["Muzz", "Tinder", "OkCupid", "Hawaya", "Dil Mil", "Badoo"],
  af: ["Tinder", "Hinge", "Bumble", "Badoo", "OkCupid", "Muzz"],
  ca: ["Tinder", "Hinge", "Badoo", "Bumble", "happn", "Meetic", "Plenty of Fish"],
  sk: ["Tinder", "Hinge", "Badoo", "Bumble", "Pokec", "happn", "Seznamka"],
  hr: ["Tinder", "Hinge", "Badoo", "Bumble", "Amore", "happn", "MojMatch"],
  bg: ["Tinder", "Hinge", "Badoo", "Bumble", "Facebook Dating", "POF", "OkCupid"],
  sr: ["Tinder", "Hinge", "Badoo", "Bumble", "Ljubav", "MojMatch", "happn"],
  sl: ["Tinder", "Hinge", "Badoo", "Bumble", "Ona", "Zmenkarije", "happn"],
  lt: ["Tinder", "Hinge", "Badoo", "Bumble", "Draugas", "POF", "happn"],
  lv: ["Tinder", "Hinge", "Badoo", "Bumble", "Otrapuse", "POF", "happn"],
  et: ["Tinder", "Hinge", "Badoo", "Bumble", "Suhtlusportaal", "POF", "happn"],
  sw: ["Tinder", "Badoo", "Bumble", "Muzz", "Mingle2", "OkCupid"],
};

const FALLBACK_APPS = EN_APPS;

for (const locale of SUPPORTED_LOCALE_TAGS) {
  if (!DATING_APPS_BY_LOCALE[locale]) {
    throw new Error(`[dating-apps] missing locale: ${locale}`);
  }
}

export function getDatingAppsForLocale(locale: string): readonly string[] {
  return DATING_APPS_BY_LOCALE[locale] ?? FALLBACK_APPS;
}
