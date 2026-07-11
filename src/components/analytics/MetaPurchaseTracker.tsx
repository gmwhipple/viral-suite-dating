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
    trackPurchase({
      eventId: purchaseEventIdFromSession(sessionId),
    });
    console.log("[meta/pixel] Purchase tracked", { sessionId: sessionId.slice(0, 12) });
  }, [searchParams]);

  return null;
}
