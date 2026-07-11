"use client";

import { APP_NAME } from "@/lib/constants";

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventNameOrPixelId: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    _fbq?: Window["fbq"];
  }
}

export function getMetaCookie(name: "_fbc" | "_fbp"): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getMetaCheckoutAttribution(eventId: string) {
  return {
    fbc: getMetaCookie("_fbc"),
    fbp: getMetaCookie("_fbp"),
    eventId,
    sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
  };
}

export function trackMetaPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", eventName, params, { eventID: eventId });
    return;
  }
  window.fbq("track", eventName, params);
}

export function trackViewContent() {
  trackMetaPixelEvent("ViewContent", {
    content_name: APP_NAME,
    content_category: "dating_profile_photos",
  });
}

export function trackInitiateCheckout(params: {
  value: number;
  currency: string;
  eventId: string;
}) {
  trackMetaPixelEvent(
    "InitiateCheckout",
    {
      content_name: APP_NAME,
      value: params.value,
      currency: params.currency,
    },
    params.eventId
  );
}

export function trackPurchase(params: {
  value?: number;
  currency?: string;
  eventId: string;
}) {
  trackMetaPixelEvent(
    "Purchase",
    {
      content_name: APP_NAME,
      ...(params.value != null ? { value: params.value } : {}),
      ...(params.currency ? { currency: params.currency } : {}),
    },
    params.eventId
  );
}

export function createCheckoutClickEventId(): string {
  return `checkout_click_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function purchaseEventIdFromSession(sessionId: string): string {
  return `purchase_${sessionId}`;
}
