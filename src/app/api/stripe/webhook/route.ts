import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isCheckoutBlocked } from "@/lib/stripe-pricing";
import { activatePaidPlan } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";
import { trackABEvent } from "@/lib/ab-testing";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.log("[stripe/webhook] signature error", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const billingCountry = session.customer_details?.address?.country;

    if (billingCountry && isCheckoutBlocked(billingCountry)) {
      console.log("[stripe/webhook] blocked country at billing", billingCountry, session.id);
      return NextResponse.json({ received: true, blocked: true });
    }

    if (userId) {
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || `guest_${session.id}`;

      await activatePaidPlan(userId, customerId);
      await logActivity(userId, "payment_completed", {
        sessionId: session.id,
        amountTotal: session.amount_total,
        pricingTier: session.metadata?.pricingTier,
        priceUsd: session.metadata?.priceUsd,
        countryCode: session.metadata?.countryCode,
      });
      await trackABEvent("A", "purchase", session.id, userId);
    }
  }

  return NextResponse.json({ received: true });
}
