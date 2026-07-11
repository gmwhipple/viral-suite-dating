"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  getDefaultDictionary,
  loadDictionary,
  type Dictionary,
} from "@/lib/i18n";
import {
  detectClientLocale,
  isRtlLocale,
  normalizeLocaleTag,
  persistLocaleChoice,
} from "@/lib/i18n/locale-detection";

function applyDocumentLocale(locale: string): void {
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
}

async function resolveDictionary(locale: string): Promise<Dictionary> {
  if (locale === DEFAULT_LOCALE) return getDefaultDictionary();
  return loadDictionary(locale);
}

/**
 * Resolves the visitor's system/browser language and returns the matching
 * dictionary. Renders English immediately (SSR-safe), then swaps in the
 * localized copy once resolved.
 */
export function useTranslations(): {
  t: Dictionary;
  locale: string;
  setLocale: (locale: string) => void;
} {
  const [state, setState] = useState<{ t: Dictionary; locale: string }>(() => ({
    t: getDefaultDictionary(),
    locale: DEFAULT_LOCALE,
  }));

  useEffect(() => {
    let cancelled = false;
    const locale = detectClientLocale();
    applyDocumentLocale(locale);

    resolveDictionary(locale)
      .then((t) => {
        if (!cancelled) setState({ t, locale });
      })
      .catch((err) => console.log("[i18n] failed to load locale", locale, err));

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: string) => {
    const locale = normalizeLocaleTag(next) ?? DEFAULT_LOCALE;
    persistLocaleChoice(locale);
    applyDocumentLocale(locale);

    resolveDictionary(locale)
      .then((t) => setState({ t, locale }))
      .catch((err) => console.log("[i18n] failed to switch locale", locale, err));
  }, []);

  return { ...state, setLocale };
}
