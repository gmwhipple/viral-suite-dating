"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  createCheckoutClickEventId,
  getMetaCheckoutAttribution,
  trackInitiateCheckout,
} from "@/lib/meta-browser";
import {
  getRedditCheckoutAttribution,
  trackAddToCart,
} from "@/lib/reddit-browser";

export function useGuestCheckout(
  locale: string,
  priceUsd = 199,
  currency = "USD",
  country: string | null = null
) {
  const { token, user } = useAuth();
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
        const redditAttribution = getRedditCheckoutAttribution(checkoutEventId, {
          email: user?.email ?? undefined,
          externalId: user?.uid,
        });

        trackInitiateCheckout({
          value: priceUsd,
          currency,
          eventId: checkoutEventId,
        });

        trackAddToCart({
          value: priceUsd,
          currency,
          eventId: checkoutEventId,
          email: user?.email ?? undefined,
          externalId: user?.uid,
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
            ...(country ? { country } : {}),
            fbc: attribution.fbc,
            fbp: attribution.fbp,
            sourceUrl: attribution.sourceUrl,
            checkoutEventId: attribution.eventId,
            rdtCid: redditAttribution.rdtCid,
            rdtUuid: redditAttribution.rdtUuid,
            screenWidth: redditAttribution.screenWidth,
            screenHeight: redditAttribution.screenHeight,
          }),
        });
        const data = (await res.json()) as {
          blocked?: boolean;
          error?: string;
          url?: string;
          tier?: string;
        };

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
    [locale, token, user, priceUsd, currency, country]
  );

  return {
    startCheckout,
    checkingOut,
    checkoutError,
    checkoutBlocked,
  };
}
