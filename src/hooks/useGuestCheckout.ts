"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  createCheckoutClickEventId,
  getMetaCheckoutAttribution,
  trackInitiateCheckout,
} from "@/lib/meta-browser";

export function useGuestCheckout(locale: string, priceUsd = 199, currency = "USD") {
  const { token } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutBlocked, setCheckoutBlocked] = useState(false);

  const startCheckout = useCallback(
    async (onTrack?: () => void) => {
      onTrack?.();
      setCheckingOut(true);
      setCheckoutError(null);
      setCheckoutBlocked(false);

      try {
        const checkoutEventId = createCheckoutClickEventId();
        const attribution = getMetaCheckoutAttribution(checkoutEventId);

        trackInitiateCheckout({
          value: priceUsd,
          currency,
          eventId: checkoutEventId,
        });

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers,
          body: JSON.stringify({
            locale,
            fbc: attribution.fbc,
            fbp: attribution.fbp,
            sourceUrl: attribution.sourceUrl,
            checkoutEventId: attribution.eventId,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (data.blocked) {
            setCheckoutBlocked(true);
            setCheckoutError(
              "Checkout is not available in your region. Contact support if you believe this is an error."
            );
          } else {
            setCheckoutError(data.error || "Checkout failed. Please try again.");
          }
          console.log("[checkout] failed", { status: res.status, data });
          return;
        }

        if (data.url) {
          console.log("[checkout] redirecting to Stripe", { locale, tier: data.tier });
          window.location.href = data.url;
          return;
        }

        setCheckoutError("Checkout failed. Please try again.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Checkout failed";
        setCheckoutError(message);
        console.log("[checkout] error", message);
      } finally {
        setCheckingOut(false);
      }
    },
    [locale, token, priceUsd, currency]
  );

  return {
    startCheckout,
    checkingOut,
    checkoutError,
    checkoutBlocked,
  };
}
