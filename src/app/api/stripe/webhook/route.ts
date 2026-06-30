import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
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

    if (userId) {
      await activatePaidPlan(userId, session.customer as string);
      await logActivity(userId, "payment_completed", {
        sessionId: session.id,
        amountTotal: session.amount_total,
      });
      await trackABEvent("A", "purchase", session.id, userId);
    }
  }

  return NextResponse.json({ received: true });
}
