import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { logActivity } from "@/lib/activity-log";
import { getClientIp } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { getClientCountry } from "@/lib/client-country";
import { getLocalizedPrice, isCheckoutBlocked } from "@/lib/stripe-pricing";

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const country = getClientCountry(request);
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

  const localizedPrice = getLocalizedPrice(country);
  const appUrl = getAppBaseUrl(request);

  try {
    const session = await createCheckoutSession({
      userId: auth.uid,
      email: auth.email,
      successUrl: `${appUrl}/dashboard?payment=success`,
      cancelUrl: `${appUrl}/dashboard?payment=cancelled`,
      countryCode: country,
      localizedPrice,
    });

    await logActivity(
      auth.uid,
      "checkout_started",
      {
        sessionId: session.id,
        country,
        pricingTier: localizedPrice.tier,
        priceUsd: localizedPrice.amountUsd,
      },
      {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

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
