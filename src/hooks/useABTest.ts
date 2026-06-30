"use client";

import { useEffect, useState } from "react";
import type { ABVariant } from "@/lib/ab-testing";

export function useABTest() {
  const [variant, setVariant] = useState<ABVariant>("A");
  const [sessionId, setSessionId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/ab-test")
      .then((r) => r.json())
      .then((data) => {
        setVariant(data.variant);
        setSessionId(data.sessionId);
        setReady(true);
      });
  }, []);

  const trackEvent = async (event: "cta_click" | "signup" | "purchase", userId?: string) => {
    await fetch("/api/ab-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, sessionId, variant, userId }),
    });
  };

  return { variant, sessionId, ready, trackEvent };
}
