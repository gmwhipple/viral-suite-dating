/**
 * Shared Reddit event IDs — browser pixel (conversionId) and CAPI (conversion_id)
 * must match exactly for deduplication.
 */

export const REDDIT_EVENT = {
  PageVisit: "PageVisit",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  Purchase: "Purchase",
} as const;

export const REDDIT_CONVERSION_PRODUCT = {
  id: "profile-makeover-pro",
  name: "Profile Makeover Pro",
  category: "dating_profile_photos",
} as const;

export type RedditConversionProduct = {
  id: string;
  name: string;
  category: string;
};

/** Browser + CAPI checkout start — generated on checkout button click. */
export function createRedditCheckoutEventId(): string {
  return `checkout_click_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Browser + CAPI Purchase — tied to Stripe checkout session id (cs_...). */
export function redditPurchaseEventId(sessionId: string): string {
  return `purchase_${sessionId}`;
}
