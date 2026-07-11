import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { logActivity } from "@/lib/activity-log";
import { getClientIp } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { getClientCountry } from "@/lib/client-country";
import { detectServerLocale, normalizeLocaleTag } from "@/lib/i18n/locale-detection";
import { getLocalizedPrice, isCheckoutBlocked } from "@/lib/stripe-pricing";
import {
  checkoutEventId,
  isMetaCapiConfigured,
  sendMetaServerEvents,
} from "@/lib/meta-capi";

async function parseCheckoutBody(request: NextRequest): Promise<{
  locale?: string;
  fbc?: string;
  fbp?: string;
  sourceUrl?: string;
  checkoutEventId?: string;
}> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) return {};

  try {
    const body = (await request.json()) as {
      locale?: string;
      fbc?: string;
      fbp?: string;
      sourceUrl?: string;
      checkoutEventId?: string;
    };
    return {
      locale: typeof body?.locale === "string" ? normalizeLocaleTag(body.locale) ?? undefined : undefined,
      fbc: typeof body?.fbc === "string" ? body.fbc : undefined,
      fbp: typeof body?.fbp === "string" ? body.fbp : undefined,
      sourceUrl: typeof body?.sourceUrl === "string" ? body.sourceUrl : undefined,
      checkoutEventId: typeof body?.checkoutEventId === "string" ? body.checkoutEventId : undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  const body = await parseCheckoutBody(request);
  const bodyLocale = body.locale;

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const country = getClientCountry(request);
  const locale =
    bodyLocale ?? detectServerLocale(request.headers.get("accept-language"));
  const preferLocale = Boolean(bodyLocale);

  if (isCheckoutBlocked(country)) {
    return NextResponse.json(
      {
        error:
          "Checkout is not available in your region. Contact support if you believe this is an error.",
        blocked: true,
        country,
      },
      { status: 403 }
    );
  }

  const localizedPrice = getLocalizedPrice(country, locale, { preferLocale });
  const appUrl = getAppBaseUrl(request);
  const isGuest = !auth;

  const successUrl = isGuest
    ? `${appUrl}/login?mode=signup&payment=success&session_id={CHECKOUT_SESSION_ID}`
    : `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = isGuest
    ? `${appUrl}/?payment=cancelled`
    : `${appUrl}/dashboard?payment=cancelled`;

  try {
    const clientIp = getClientIp(request);
    const clientUserAgent = request.headers.get("user-agent") || undefined;

    const session = await createCheckoutSession({
      ...(auth
        ? { userId: auth.uid, email: auth.email }
        : {}),
      successUrl,
      cancelUrl,
      countryCode: country,
      localizedPrice,
      locale,
      metaAttribution: {
        fbc: body.fbc,
        fbp: body.fbp,
        clientIp,
        clientUserAgent,
        sourceUrl: body.sourceUrl || request.headers.get("referer") || `${appUrl}/`,
        checkoutEventId: body.checkoutEventId,
        externalId: auth?.uid,
      },
    });

    const logUserId = auth?.uid ?? `guest_${session.id}`;
    await logActivity(
      logUserId,
      "checkout_started",
      {
        sessionId: session.id,
        country,
        locale,
        guest: isGuest,
        pricingTier: localizedPrice.tier,
        priceUsd: localizedPrice.amountUsd,
      },
      {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    if (isMetaCapiConfigured()) {
      await sendMetaServerEvents([
        {
          eventName: "InitiateCheckout",
          eventId: body.checkoutEventId || checkoutEventId(session.id),
          eventSourceUrl: body.sourceUrl || request.headers.get("referer") || `${appUrl}/`,
          userData: {
            email: auth?.email,
            externalId: auth?.uid,
            clientIpAddress: clientIp,
            clientUserAgent,
            fbc: body.fbc,
            fbp: body.fbp,
            country,
          },
          customData: {
            currency: localizedPrice.currency.toUpperCase(),
            value: localizedPrice.amount,
            contentName: "Profile Makeover Pro",
          },
        },
      ]);
    }

    console.log("[stripe/checkout] session created", {
      sessionId: session.id,
      guest: isGuest,
      locale,
      country,
      tier: localizedPrice.tier,
    });

    return NextResponse.json({
      url: session.url,
      priceUsd: localizedPrice.amountUsd,
      tier: localizedPrice.tier,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.log("[stripe/checkout] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
