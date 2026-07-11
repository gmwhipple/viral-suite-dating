import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

/** Public checkout summary for Meta pixel on the success page (value + currency only). */
export async function GET(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId?.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 403 });
    }

    const value =
      session.amount_total != null
        ? session.amount_total / 100
        : Number(session.metadata?.priceUsd || 0);
    const currency = (session.currency || "usd").toUpperCase();

    return NextResponse.json({ value, currency });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load session";
    console.log("[stripe/session] retrieve error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
