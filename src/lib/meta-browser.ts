"use client";

import { APP_NAME } from "@/lib/constants";
import {
  META_EVENT,
  createInitiateCheckoutEventId,
  purchaseEventId,
} from "@/lib/meta-event-ids";

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
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
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
    console.log("[meta/pixel]", { eventName, eventId });
    return;
  }

  window.fbq("track", eventName, params);
  console.log("[meta/pixel]", { eventName });
}

const VIEW_CONTENT_KEY = "meta_viewcontent_sent";

export function trackViewContent() {
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(VIEW_CONTENT_KEY)) {
    return;
  }
  trackMetaPixelEvent(META_EVENT.ViewContent, {
    content_name: APP_NAME,
    content_category: "dating_profile_photos",
  });
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(VIEW_CONTENT_KEY, "1");
  }
}

export function trackInitiateCheckout(params: {
  value: number;
  currency: string;
  eventId: string;
}) {
  trackMetaPixelEvent(
    META_EVENT.InitiateCheckout,
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
    META_EVENT.Purchase,
    {
      content_name: APP_NAME,
      ...(params.value != null ? { value: params.value } : {}),
      ...(params.currency ? { currency: params.currency } : {}),
    },
    params.eventId
  );
}

/** @deprecated Use createInitiateCheckoutEventId */
export const createCheckoutClickEventId = createInitiateCheckoutEventId;

/** @deprecated Use purchaseEventId */
export function purchaseEventIdFromSession(sessionId: string): string {
  return purchaseEventId(sessionId);
}

export { createInitiateCheckoutEventId, purchaseEventId };
