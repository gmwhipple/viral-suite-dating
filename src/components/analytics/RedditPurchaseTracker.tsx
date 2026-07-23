"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { redditPurchaseEventId, trackPurchase } from "@/lib/reddit-browser";

const purchaseStorageKey = (sessionId: string) => `reddit_purchase_${sessionId}`;

export function RedditPurchaseTracker() {
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (searchParams.get("payment") !== "success") return;

    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const eventId = redditPurchaseEventId(sessionId);

    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem(purchaseStorageKey(sessionId))) {
        console.log("[reddit/pixel] Purchase already sent for session", sessionId.slice(0, 12));
        return;
      }
    }

    firedRef.current = true;

    (async () => {
      let value: number | undefined;
      let currency: string | undefined;

      try {
        const res = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { value?: number; currency?: string };
          if (typeof data.value === "number") value = data.value;
          if (typeof data.currency === "string") currency = data.currency;
        }
      } catch (err) {
        console.log("[reddit/pixel] session lookup failed", err);
      }

      trackPurchase({
        eventId,
        value,
        currency,
      });

      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(purchaseStorageKey(sessionId), eventId);
      }

      console.log("[reddit/pixel] Purchase tracked", {
        eventId,
        sessionId: sessionId.slice(0, 12),
        value,
        currency,
      });
    })();
  }, [searchParams]);

  return null;
}
