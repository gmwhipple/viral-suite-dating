"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { purchaseEventIdFromSession, trackPurchase } from "@/lib/meta-browser";

export function MetaPurchaseTracker() {
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (searchParams.get("payment") !== "success") return;

    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

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
        console.log("[meta/pixel] session lookup failed", err);
      }

      trackPurchase({
        eventId: purchaseEventIdFromSession(sessionId),
        value,
        currency,
      });
      console.log("[meta/pixel] Purchase tracked", {
        sessionId: sessionId.slice(0, 12),
        value,
        currency,
      });
    })();
  }, [searchParams]);

  return null;
}
