"use client";

import { APP_NAME } from "@/lib/constants";
import {
  REDDIT_CONVERSION_PRODUCT,
  REDDIT_EVENT,
  createRedditCheckoutEventId,
  redditPurchaseEventId,
} from "@/lib/reddit-event-ids";

const RDT_CID_KEY = "reddit_rdt_cid";

declare global {
  interface Window {
    rdt?: (
      command: string,
      eventNameOrPixelId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function getScreenDimensions(): { width: number; height: number } | undefined {
  if (typeof window === "undefined") return undefined;

  const width = window.screen?.width;
  const height = window.screen?.height;
  if (!width || !height) return undefined;

  return { width, height };
}

function buildPixelProducts() {
  return [
    {
      id: REDDIT_CONVERSION_PRODUCT.id,
      name: REDDIT_CONVERSION_PRODUCT.name,
      category: REDDIT_CONVERSION_PRODUCT.category,
    },
  ];
}

function buildMatchKeys(matchKeys?: {
  email?: string;
  externalId?: string;
}) {
  return {
    ...(matchKeys?.email ? { email: matchKeys.email } : {}),
    ...(matchKeys?.externalId ? { externalId: matchKeys.externalId } : {}),
    ...(getRedditUuidCookie() ? { uuid: getRedditUuidCookie() } : {}),
  };
}

export function captureRedditClickId(): void {
  if (typeof window === "undefined") return;

  const cid = new URLSearchParams(window.location.search).get("rdt_cid");
  if (!cid) return;

  try {
    sessionStorage.setItem(RDT_CID_KEY, cid);
    console.log("[reddit/pixel] captured rdt_cid", cid.slice(0, 12));
  } catch {
    // ignore quota / private mode
  }
}

export function getRedditClickId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return sessionStorage.getItem(RDT_CID_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export function getRedditUuidCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(/(?:^|; )_rdt_uuid=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getRedditCheckoutAttribution(
  eventId: string,
  matchKeys?: {
    email?: string;
    externalId?: string;
  }
) {
  const screen = getScreenDimensions();

  return {
    rdtCid: getRedditClickId(),
    rdtUuid: getRedditUuidCookie(),
    eventId,
    sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    screenWidth: screen?.width,
    screenHeight: screen?.height,
    email: matchKeys?.email,
    externalId: matchKeys?.externalId,
  };
}

export function trackRedditPixelEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.rdt !== "function") return;

  window.rdt("track", eventName, params);
  console.log("[reddit/pixel]", { eventName, conversionId: params?.conversionId });
}

const VIEW_CONTENT_KEY = "reddit_viewcontent_sent";

export function trackViewContent() {
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(VIEW_CONTENT_KEY)) {
    return;
  }

  trackRedditPixelEvent(REDDIT_EVENT.ViewContent, {
    conversionId: `viewcontent_${Date.now()}`,
    contentName: APP_NAME,
    contentCategory: REDDIT_CONVERSION_PRODUCT.category,
    products: buildPixelProducts(),
    ...buildMatchKeys(),
  });

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(VIEW_CONTENT_KEY, "1");
  }
}

export function trackAddToCart(params: {
  value: number;
  currency: string;
  eventId: string;
  email?: string;
  externalId?: string;
}) {
  trackRedditPixelEvent(REDDIT_EVENT.AddToCart, {
    conversionId: params.eventId,
    value: params.value,
    currency: params.currency,
    itemCount: 1,
    products: buildPixelProducts(),
    ...buildMatchKeys({
      email: params.email,
      externalId: params.externalId,
    }),
  });
}

export function trackPurchase(params: {
  value?: number;
  currency?: string;
  eventId: string;
  email?: string;
  externalId?: string;
}) {
  trackRedditPixelEvent(REDDIT_EVENT.Purchase, {
    conversionId: params.eventId,
    itemCount: 1,
    products: buildPixelProducts(),
    ...(params.value != null ? { value: params.value } : {}),
    ...(params.currency ? { currency: params.currency } : {}),
    ...buildMatchKeys({
      email: params.email,
      externalId: params.externalId,
    }),
  });
}

export {
  createRedditCheckoutEventId,
  redditPurchaseEventId,
};
