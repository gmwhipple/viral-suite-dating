"use client";

import { useEffect, useState } from "react";
import type { ABVariant } from "@/lib/ab-testing";

export function useABTest() {
  const [variant, setVariant] = useState<ABVariant>("A");
  const [sessionId, setSessionId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const finish = (data?: { variant?: ABVariant; sessionId?: string }) => {
      if (cancelled) return;
      setVariant(data?.variant === "B" ? "B" : "A");
      if (data?.sessionId) setSessionId(data.sessionId);
      setReady(true);
    };

    const timeout = window.setTimeout(() => finish(), 4000);

    fetch("/api/ab-test")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`ab-test ${r.status}`))))
      .then((data) => {
        window.clearTimeout(timeout);
        finish(data);
      })
      .catch((err) => {
        console.log("[ab-test] fallback", err);
        window.clearTimeout(timeout);
        finish();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
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
