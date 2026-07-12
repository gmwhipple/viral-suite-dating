"use client";

import { useEffect, useMemo, useState } from "react";
import { getDisplayPricesForLocale, type DisplayPrices } from "@/lib/pricing-display";

type PricingState = {
  prices: DisplayPrices;
  loading: boolean;
  blocked: boolean;
  country: string | null;
};

/**
 * Prices use the visitor's geo country (Cloudflare cf-ipcountry) for currency/tier.
 * Locale only affects number formatting labels and checkout language — not MX-by-default for `es`.
 */
export function useLocalizedPricing(locale: string): PricingState {
  const fallback = useMemo(() => getDisplayPricesForLocale(locale), [locale]);
  const [state, setState] = useState<PricingState>({
    prices: fallback,
    loading: true,
    blocked: false,
    country: null,
  });

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({ locale });
    if (typeof window !== "undefined") {
      const countryOverride = new URLSearchParams(window.location.search).get("country");
      if (countryOverride) params.set("country", countryOverride);
    }

    fetch(`/api/stripe/pricing?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        setState({
          prices: {
            tier: data.tier,
            currency: data.currency,
            productAmount: data.amount,
            photographerAmount: data.photographerAmount,
            productLabel: data.label,
            photographerLabel: data.photographerLabel,
          },
          loading: false,
          blocked: Boolean(data.blocked),
          country: typeof data.country === "string" ? data.country : null,
        });
      })
      .catch((err) => {
        console.log("[pricing] fetch failed", err);
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return state;
}
