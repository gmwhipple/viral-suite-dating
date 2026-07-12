import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { logActivity } from "@/lib/activity-log";
import { getClientIp } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { detectServerLocale, normalizeLocaleTag } from "@/lib/i18n/locale-detection";
import { getLocalizedPrice, isCheckoutBlocked, preferLocalePricing } from "@/lib/stripe-pricing";
import { resolveClientCountry } from "@/lib/resolve-client-country";
import {
  isMetaCapiConfigured,
  sendMetaServerEvents,
} from "@/lib/meta-capi";
import { META_EVENT } from "@/lib/meta-event-ids";

async function parseCheckoutBody(request: NextRequest): Promise<{
  locale?: string;
  country?: string;
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
      country?: string;
      fbc?: string;
      fbp?: string;
      sourceUrl?: string;
      checkoutEventId?: string;
    };
    return {
      locale: typeof body?.locale === "string" ? normalizeLocaleTag(body.locale) ?? undefined : undefined,
      country:
        typeof body?.country === "string" && body.country.trim().length === 2
          ? body.country.trim().toUpperCase()
          : undefined,
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

  const countryParam = request.nextUrl.searchParams.get("country");
  const country = await resolveClientCountry(
    request,
    body.country || countryParam
  );
  const locale =
    bodyLocale ?? detectServerLocale(request.headers.get("accept-language"));

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

  const localizedPrice = getLocalizedPrice(country, locale, {
    preferLocale: preferLocalePricing(country, Boolean(bodyLocale)),
  });
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

    if (isMetaCapiConfigured() && body.checkoutEventId) {
      await sendMetaServerEvents([
        {
          eventName: META_EVENT.InitiateCheckout,
          eventId: body.checkoutEventId,
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
    } else if (isMetaCapiConfigured()) {
      console.log("[meta/capi] skipped InitiateCheckout — missing checkoutEventId (pixel/CAPI dedup requires same id)");
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
