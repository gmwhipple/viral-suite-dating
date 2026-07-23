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

function normalizeMetaPhone(phone?: string | null): string | undefined {
  if (!phone?.trim()) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : undefined;
}

function normalizeMetaState(state?: string | null, country?: string | null): string | undefined {
  if (!state?.trim()) return undefined;
  const cleaned = state.trim().replace(/[^a-z0-9]/gi, "");
  if (!cleaned) return undefined;
  if (cleaned.length === 2) return cleaned.toLowerCase();

  const countryCode = country?.trim().toLowerCase();
  if (countryCode === "us" || countryCode === "usa") {
    const usStates: Record<string, string> = {
      alabama: "al",
      alaska: "ak",
      arizona: "az",
      arkansas: "ar",
      california: "ca",
      colorado: "co",
      connecticut: "ct",
      delaware: "de",
      florida: "fl",
      georgia: "ga",
      hawaii: "hi",
      idaho: "id",
      illinois: "il",
      indiana: "in",
      iowa: "ia",
      kansas: "ks",
      kentucky: "ky",
      louisiana: "la",
      maine: "me",
      maryland: "md",
      massachusetts: "ma",
      michigan: "mi",
      minnesota: "mn",
      mississippi: "ms",
      missouri: "mo",
      montana: "mt",
      nebraska: "ne",
      nevada: "nv",
      newhampshire: "nh",
      newjersey: "nj",
      newmexico: "nm",
      newyork: "ny",
      northcarolina: "nc",
      northdakota: "nd",
      ohio: "oh",
      oklahoma: "ok",
      oregon: "or",
      pennsylvania: "pa",
      rhodeisland: "ri",
      southcarolina: "sc",
      southdakota: "sd",
      tennessee: "tn",
      texas: "tx",
      utah: "ut",
      vermont: "vt",
      virginia: "va",
      washington: "wa",
      westvirginia: "wv",
      wisconsin: "wi",
      wyoming: "wy",
      districtofcolumbia: "dc",
    };
    const mapped = usStates[cleaned.toLowerCase()];
    if (mapped) return mapped;
  }

  return cleaned.toLowerCase();
}

function normalizeMetaZip(postal?: string | null, country?: string | null): string | undefined {
  if (!postal?.trim()) return undefined;
  const countryCode = country?.trim().toLowerCase();
  const compact = postal.trim().replace(/\s/g, "").toLowerCase();

  if (countryCode === "us" || countryCode === "usa") {
    const digits = compact.replace(/[^\d]/g, "");
    return digits.slice(0, 5) || undefined;
  }

  return compact.replace(/-/g, "") || undefined;
}

function normalizeMetaCountry(country?: string | null): string | undefined {
  if (!country?.trim()) return undefined;
  const cleaned = country.trim().toLowerCase();
  if (cleaned.length === 2) return cleaned;
  if (cleaned === "usa" || cleaned === "unitedstates") return "us";
  if (cleaned === "uk" || cleaned === "unitedkingdom" || cleaned === "greatbritain") return "gb";
  return cleaned.slice(0, 2);
}

function isValidClientIp(ip?: string | null): ip is string {
  if (!ip?.trim() || ip.trim().toLowerCase() === "unknown") return false;
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip.trim()) || /:/.test(ip.trim());
}

export function metaUserDataFieldCoverage(input: MetaUserDataInput): Record<string, boolean> {
  return {
    email: Boolean(input.email?.trim()),
    phone: Boolean(normalizeMetaPhone(input.phone)),
    firstName: Boolean(input.firstName?.trim()),
    lastName: Boolean(input.lastName?.trim()),
    city: Boolean(input.city?.trim()),
    state: Boolean(normalizeMetaState(input.state, input.country)),
    zip: Boolean(normalizeMetaZip(input.zip, input.country)),
    country: Boolean(normalizeMetaCountry(input.country)),
    externalId: Boolean(input.externalId?.trim()),
    clientIpAddress: isValidClientIp(input.clientIpAddress),
    clientUserAgent: Boolean(input.clientUserAgent?.trim()),
    fbc: Boolean(input.fbc?.trim()),
    fbp: Boolean(input.fbp?.trim()),
  };
}

export function buildMetaUserData(input: MetaUserDataInput): Record<string, string | string[]> {
  const userData: Record<string, string | string[]> = {};

  if (input.email?.trim()) userData.em = [hashMetaField(input.email)];
  const phone = normalizeMetaPhone(input.phone);
  if (phone) userData.ph = [hashMetaField(phone)];
  if (input.firstName?.trim()) userData.fn = [hashMetaField(input.firstName)];
  if (input.lastName?.trim()) userData.ln = [hashMetaField(input.lastName)];

  const country = normalizeMetaCountry(input.country);
  if (input.city?.trim()) userData.ct = [hashMetaField(input.city.replace(/[^a-z0-9]/gi, ""))];
  const state = normalizeMetaState(input.state, country);
  if (state) userData.st = [hashMetaField(state)];
  const zip = normalizeMetaZip(input.zip, country);
  if (zip) userData.zp = [hashMetaField(zip)];
  if (country) userData.country = [hashMetaField(country)];

  if (input.externalId?.trim()) userData.external_id = [hashMetaField(input.externalId)];

  if (isValidClientIp(input.clientIpAddress)) userData.client_ip_address = input.clientIpAddress.trim();
  if (input.clientUserAgent?.trim()) userData.client_user_agent = input.clientUserAgent.trim();
  if (input.fbc?.trim()) userData.fbc = input.fbc.trim();
  if (input.fbp?.trim()) userData.fbp = input.fbp.trim();

  return userData;
}

type StripeAddressLike = {
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  line1?: string | null;
  line2?: string | null;
} | null | undefined;

type StripeCustomerDetailsLike = {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: StripeAddressLike;
} | null | undefined;

type StripeCustomerLike = {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: StripeAddressLike;
} | null | undefined;

export function buildMetaUserDataFromStripeSession(session: {
  customer_details?: StripeCustomerDetailsLike;
  customer_email?: string | null;
  metadata?: Record<string, string> | null;
}, customer?: StripeCustomerLike): MetaUserDataInput {
  const details = session.customer_details;
  const address = details?.address || customer?.address;
  const country = address?.country;
  const nameParts = splitName(details?.name || customer?.name);

  return {
    email: details?.email || session.customer_email || customer?.email,
    phone: details?.phone || customer?.phone,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    city: address?.city,
    state: address?.state,
    zip: address?.postal_code,
    country,
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
        userDataFields: event.userData ? metaUserDataFieldCoverage(event.userData) : {},
        capiKeys: event.userData ? Object.keys(buildMetaUserData(event.userData)) : [],
      })),
      received: json.events_received,
    });
    return true;
  } catch (err) {
    console.log("[meta/capi] request failed", err instanceof Error ? err.message : err);
    return false;
  }
}
