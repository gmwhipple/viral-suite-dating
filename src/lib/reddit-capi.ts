import crypto from "crypto";
import {
  REDDIT_CONVERSION_PRODUCT,
  REDDIT_EVENT,
  redditPurchaseEventId,
  type RedditConversionProduct,
} from "@/lib/reddit-event-ids";

export { redditPurchaseEventId, REDDIT_CONVERSION_PRODUCT } from "@/lib/reddit-event-ids";

export type RedditCapiEventName =
  | typeof REDDIT_EVENT.ViewContent
  | typeof REDDIT_EVENT.AddToCart
  | typeof REDDIT_EVENT.Purchase;

export interface RedditUserDataInput {
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  clickId?: string | null;
  uuid?: string | null;
  screenWidth?: number | null;
  screenHeight?: number | null;
}

export interface RedditServerEventInput {
  eventName: RedditCapiEventName;
  eventTime?: number;
  conversionId: string;
  eventSourceUrl?: string;
  userData?: RedditUserDataInput;
  customData?: {
    currency?: string;
    value?: number;
    itemCount?: number;
    products?: RedditConversionProduct[];
  };
}

function getPixelId(): string | undefined {
  return (
    process.env.REDDIT_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID?.trim() ||
    undefined
  );
}

function getAccessToken(): string | undefined {
  return process.env.REDDIT_CONVERSION_ACCESS_TOKEN?.trim();
}

export function isRedditCapiConfigured(): boolean {
  return Boolean(getPixelId() && getAccessToken());
}

export function hashRedditField(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizeRedditPhone(phone?: string | null): string | undefined {
  if (!phone?.trim()) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : undefined;
}

function isValidClientIp(ip?: string | null): ip is string {
  if (!ip?.trim() || ip.trim().toLowerCase() === "unknown") return false;
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip.trim()) || /:/.test(ip.trim());
}

function isValidScreenDimension(value?: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function buildRedditUser(userData?: RedditUserDataInput): Record<string, unknown> {
  const user: Record<string, unknown> = {};

  if (userData?.email?.trim()) {
    user.email = hashRedditField(userData.email);
  }

  const phone = normalizeRedditPhone(userData?.phone);
  if (phone) {
    user.phone_number = hashRedditField(phone);
  }

  if (userData?.externalId?.trim()) {
    user.external_id = hashRedditField(userData.externalId);
  }

  if (isValidClientIp(userData?.clientIpAddress)) {
    user.ip_address = userData.clientIpAddress.trim();
  }

  if (userData?.clientUserAgent?.trim()) {
    user.user_agent = userData.clientUserAgent.trim();
  }

  if (
    isValidScreenDimension(userData?.screenWidth) &&
    isValidScreenDimension(userData?.screenHeight)
  ) {
    user.screen_dimensions = {
      width: Math.round(userData.screenWidth),
      height: Math.round(userData.screenHeight),
    };
  }

  if (userData?.uuid?.trim()) {
    user.uuid = userData.uuid.trim();
  }

  return user;
}

function buildRedditMetadata(event: RedditServerEventInput): Record<string, unknown> {
  const metadata: Record<string, unknown> = {
    conversion_id: event.conversionId,
  };

  if (event.customData?.itemCount != null) {
    metadata.item_count = event.customData.itemCount;
  }

  if (event.customData?.currency) {
    metadata.currency = event.customData.currency;
  }

  if (event.customData?.value != null) {
    metadata.value = event.customData.value;
  }

  const products = event.customData?.products?.length
    ? event.customData.products
    : [REDDIT_CONVERSION_PRODUCT];

  metadata.products = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
  }));

  return metadata;
}

export function redditUserDataFieldCoverage(
  input: RedditUserDataInput
): Record<string, boolean> {
  return {
    clickId: Boolean(input.clickId?.trim()),
    email: Boolean(input.email?.trim()),
    phone: Boolean(normalizeRedditPhone(input.phone)),
    externalId: Boolean(input.externalId?.trim()),
    clientIpAddress: isValidClientIp(input.clientIpAddress),
    clientUserAgent: Boolean(input.clientUserAgent?.trim()),
    screenDimensions:
      isValidScreenDimension(input.screenWidth) && isValidScreenDimension(input.screenHeight),
    uuid: Boolean(input.uuid?.trim()),
  };
}

type StripeCustomerDetailsLike = {
  email?: string | null;
  phone?: string | null;
} | null | undefined;

type StripeCustomerLike = {
  email?: string | null;
  phone?: string | null;
} | null | undefined;

export function buildRedditUserDataFromStripeSession(
  session: {
    customer_details?: StripeCustomerDetailsLike;
    customer_email?: string | null;
    metadata?: Record<string, string> | null;
  },
  customer?: StripeCustomerLike
): RedditUserDataInput {
  const details = session.customer_details;
  const metadata = session.metadata;
  const screenWidth = metadata?.redditScreenWidth
    ? Number(metadata.redditScreenWidth)
    : undefined;
  const screenHeight = metadata?.redditScreenHeight
    ? Number(metadata.redditScreenHeight)
    : undefined;

  return {
    email: details?.email || session.customer_email || customer?.email,
    phone: details?.phone || customer?.phone,
    externalId: metadata?.userId || metadata?.metaExternalId,
    clientIpAddress: metadata?.metaClientIp,
    clientUserAgent: metadata?.metaClientUserAgent,
    clickId: metadata?.redditRdtCid,
    uuid: metadata?.redditUuid,
    screenWidth: Number.isFinite(screenWidth) ? screenWidth : undefined,
    screenHeight: Number.isFinite(screenHeight) ? screenHeight : undefined,
  };
}

export async function sendRedditServerEvents(events: RedditServerEventInput[]): Promise<boolean> {
  const pixelId = getPixelId();
  const accessToken = getAccessToken();

  if (!pixelId || !accessToken || events.length === 0) {
    console.log("[reddit/capi] skipped", {
      configured: Boolean(pixelId && accessToken),
      eventCount: events.length,
    });
    return false;
  }

  const testId = process.env.REDDIT_TEST_ID?.trim();

  const payload = {
    ...(testId ? { test_id: testId } : {}),
    data: {
      events: events.map((event) => {
        const user = event.userData ? buildRedditUser(event.userData) : {};
        const hasUser = Object.keys(user).length > 0;

        return {
          event_at: event.eventTime ?? Date.now(),
          action_source: "WEBSITE",
          ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
          ...(event.userData?.clickId ? { click_id: event.userData.clickId } : {}),
          type: {
            tracking_type: event.eventName,
          },
          metadata: buildRedditMetadata(event),
          ...(hasUser ? { user } : {}),
        };
      }),
    },
  };

  const url = `https://ads-api.reddit.com/api/v3/pixels/${encodeURIComponent(pixelId)}/conversion_events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      console.log("[reddit/capi] error", response.status, json.error?.message || json.message || json);
      return false;
    }

    console.log("[reddit/capi] sent", {
      events: events.map((event) => ({
        eventName: event.eventName,
        conversionId: event.conversionId,
        matchKeys: event.userData ? redditUserDataFieldCoverage(event.userData) : {},
        metadata: {
          conversionId: event.conversionId,
          itemCount: event.customData?.itemCount,
          currency: event.customData?.currency,
          value: event.customData?.value,
          products: (event.customData?.products?.length
            ? event.customData.products
            : [REDDIT_CONVERSION_PRODUCT]
          ).length,
        },
      })),
    });
    return true;
  } catch (err) {
    console.log("[reddit/capi] request failed", err instanceof Error ? err.message : err);
    return false;
  }
}
