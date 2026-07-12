import crypto from "crypto";
import { META_EVENT, purchaseEventId } from "@/lib/meta-event-ids";

export { purchaseEventId } from "@/lib/meta-event-ids";

const GRAPH_API_VERSION = "v22.0";

export type MetaCapiEventName =
  | typeof META_EVENT.ViewContent
  | typeof META_EVENT.InitiateCheckout
  | "AddPaymentInfo"
  | typeof META_EVENT.Purchase;

export interface MetaUserDataInput {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
}

export interface MetaServerEventInput {
  eventName: MetaCapiEventName;
  eventTime?: number;
  eventId?: string;
  eventSourceUrl?: string;
  userData?: MetaUserDataInput;
  customData?: {
    currency?: string;
    value?: number;
    contentName?: string;
  };
}

function getPixelId(): string | undefined {
  return (
    process.env.META_DATASET_ID?.trim() ||
    process.env.NEXT_PUBLIC_META_DATASET_ID?.trim() ||
    process.env.META_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ||
    undefined
  );
}

function getAccessToken(): string | undefined {
  return process.env.META_DATASET_QUALITY_API?.trim();
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(getPixelId() && getAccessToken());
}

export function hashMetaField(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function splitName(fullName?: string | null): { firstName?: string; lastName?: string } {
  if (!fullName?.trim()) return {};
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function buildMetaUserData(input: MetaUserDataInput): Record<string, string | string[]> {
  const userData: Record<string, string | string[]> = {};

  if (input.email) userData.em = [hashMetaField(input.email)];
  if (input.phone) userData.ph = [hashMetaField(input.phone.replace(/\D/g, ""))];
  if (input.firstName) userData.fn = [hashMetaField(input.firstName)];
  if (input.lastName) userData.ln = [hashMetaField(input.lastName)];

  if (input.city) userData.ct = [hashMetaField(input.city.replace(/[^a-z0-9]/gi, ""))];
  if (input.state) userData.st = [hashMetaField(input.state.replace(/[^a-z0-9]/gi, ""))];
  if (input.zip) userData.zp = [hashMetaField(input.zip.replace(/\s/g, ""))];
  if (input.country) userData.country = [hashMetaField(input.country)];

  if (input.externalId) userData.external_id = [hashMetaField(input.externalId)];

  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  return userData;
}

export function buildMetaUserDataFromStripeSession(session: {
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    address?: {
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  metadata?: Record<string, string> | null;
}): MetaUserDataInput {
  const nameParts = splitName(session.customer_details?.name);
  return {
    email: session.customer_details?.email,
    phone: session.customer_details?.phone,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    city: session.customer_details?.address?.city,
    state: session.customer_details?.address?.state,
    zip: session.customer_details?.address?.postal_code,
    country: session.customer_details?.address?.country,
    externalId: session.metadata?.userId || session.metadata?.metaExternalId,
    clientIpAddress: session.metadata?.metaClientIp,
    clientUserAgent: session.metadata?.metaClientUserAgent,
    fbc: session.metadata?.metaFbc,
    fbp: session.metadata?.metaFbp,
  };
}

export async function sendMetaServerEvents(events: MetaServerEventInput[]): Promise<boolean> {
  const pixelId = getPixelId();
  const accessToken = getAccessToken();

  if (!pixelId || !accessToken || events.length === 0) {
    console.log("[meta/capi] skipped", {
      configured: Boolean(pixelId && accessToken),
      eventCount: events.length,
    });
    return false;
  }

  const payload = {
    data: events.map((event) => ({
      event_name: event.eventName,
      event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
      ...(event.eventId ? { event_id: event.eventId } : {}),
      ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
      action_source: "website",
      user_data: event.userData ? buildMetaUserData(event.userData) : {},
      ...(event.customData
        ? {
            custom_data: {
              ...(event.customData.currency ? { currency: event.customData.currency } : {}),
              ...(event.customData.value != null ? { value: event.customData.value } : {}),
              ...(event.customData.contentName ? { content_name: event.customData.contentName } : {}),
            },
          }
        : {}),
    })),
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await response.json().catch(() => ({}))) as {
      events_received?: number;
      messages?: string[];
      error?: { message?: string };
    };

    if (!response.ok) {
      console.log("[meta/capi] error", response.status, json.error?.message || json);
      return false;
    }

    console.log("[meta/capi] sent", {
      events: events.map((event) => ({
        eventName: event.eventName,
        eventId: event.eventId,
      })),
      received: json.events_received,
    });
    return true;
  } catch (err) {
    console.log("[meta/capi] request failed", err instanceof Error ? err.message : err);
    return false;
  }
}
