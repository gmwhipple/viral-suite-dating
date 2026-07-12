/**
 * Shared Meta event IDs — browser pixel (eventID) and CAPI (event_id) must match
 * exactly for deduplication. Same event_name required on both sides.
 */

export const META_EVENT = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
} as const;

/** Browser + CAPI InitiateCheckout — generated on checkout button click. */
export function createInitiateCheckoutEventId(): string {
  return `checkout_click_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Browser + CAPI Purchase — tied to Stripe checkout session id (cs_...). */
export function purchaseEventId(sessionId: string): string {
  return `purchase_${sessionId}`;
}

/** @deprecated Use createInitiateCheckoutEventId — mismatched ids cause duplicate InitiateCheckout in Meta */
export function initiateCheckoutEventIdFromSession(sessionId: string): string {
  return `checkout_${sessionId}`;
}
