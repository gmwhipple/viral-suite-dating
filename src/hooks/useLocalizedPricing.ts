"use client";

import { useMemo } from "react";
import { getDisplayPricesForLocale, type DisplayPrices } from "@/lib/pricing-display";

/**
 * Prices follow the selected UI locale — French shows €, Japanese shows ¥, etc.
 * Geo headers only affect checkout on the server, not the language picker display.
 */
export function useLocalizedPricing(locale: string): {
  prices: DisplayPrices;
  loading: boolean;
  blocked: boolean;
  country: string | null;
} {
  const prices = useMemo(() => getDisplayPricesForLocale(locale), [locale]);

  return {
    prices,
    loading: false,
    blocked: false,
    country: null,
  };
}
