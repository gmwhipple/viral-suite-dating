import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isCheckoutBlocked } from "@/lib/stripe-pricing";
import { activatePaidPlan, getOrCreateUser } from "@/lib/services/users";
import {
  resolveUserIdByEmail,
  storePendingPurchase,
} from "@/lib/services/pending-purchases";
import { logActivity } from "@/lib/activity-log";
import { trackABEvent } from "@/lib/ab-testing";
import {
  buildMetaUserDataFromStripeSession,
  isMetaCapiConfigured,
  metaUserDataFieldCoverage,
  sendMetaServerEvents,
} from "@/lib/meta-capi";
import { META_EVENT, purchaseEventId } from "@/lib/meta-event-ids";
import {
  buildRedditUserDataFromStripeSession,
  isRedditCapiConfigured,
  redditUserDataFieldCoverage,
  sendRedditServerEvents,
} from "@/lib/reddit-capi";
import { REDDIT_CONVERSION_PRODUCT, REDDIT_EVENT, redditPurchaseEventId } from "@/lib/reddit-event-ids";

function isStripeCustomer(
  customer: unknown
): customer is {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: {
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
} {
  return Boolean(customer && typeof customer === "object" && !("deleted" in customer));
}

function getCheckoutEmail(session: {
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
}): string | null {
  const email = session.customer_details?.email || session.customer_email;
  if (!email) return null;
  return email.trim().toLowerCase();
}

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
    const billingCountry = session.customer_details?.address?.country;

    if (billingCountry && isCheckoutBlocked(billingCountry)) {
      console.log("[stripe/webhook] blocked country at billing", billingCountry, session.id);
      return NextResponse.json({ received: true, blocked: true });
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || `guest_${session.id}`;

    let userId = session.metadata?.userId;
    const checkoutEmail = getCheckoutEmail(session);

    console.log("[stripe/webhook] checkout completed", {
      sessionId: session.id,
      userId: userId?.slice(0, 8),
      guest: session.metadata?.guestCheckout === "true",
      hasEmail: Boolean(checkoutEmail),
    });

    if (!userId && checkoutEmail) {
      userId = (await resolveUserIdByEmail(checkoutEmail)) ?? undefined;
      if (userId) {
        await getOrCreateUser(userId, checkoutEmail, undefined, {
          claimPendingPurchase: true,
        });
        console.log("[stripe/webhook] linked purchase to existing account", {
          sessionId: session.id,
          uid: userId.slice(0, 8),
        });
      }
    }

    if (userId) {
      await activatePaidPlan(userId, customerId);
      await logActivity(userId, "payment_completed", {
        sessionId: session.id,
        amountTotal: session.amount_total,
        pricingTier: session.metadata?.pricingTier,
        priceUsd: session.metadata?.priceUsd,
        countryCode: session.metadata?.countryCode,
        email: checkoutEmail,
      });
      await trackABEvent("A", "purchase", session.id, userId);
    } else if (checkoutEmail) {
      await storePendingPurchase({
        email: checkoutEmail,
        stripeCustomerId: customerId,
        sessionId: session.id,
      });
      console.log("[stripe/webhook] stored pending purchase for new user", {
        sessionId: session.id,
        email: checkoutEmail,
      });
    } else {
      console.log("[stripe/webhook] checkout completed without user or email", session.id);
    }

    if (isMetaCapiConfigured() || isRedditCapiConfigured()) {
      const fullSession = await getStripe().checkout.sessions.retrieve(session.id, {
        expand: ["customer"],
      });
      const stripeCustomer =
        fullSession.customer && isStripeCustomer(fullSession.customer)
          ? fullSession.customer
          : null;

      const purchaseValue =
        fullSession.amount_total != null
          ? fullSession.amount_total / 100
          : Number(fullSession.metadata?.priceUsd || 0);
      const purchaseCurrency = (fullSession.currency || "usd").toUpperCase();

      if (isMetaCapiConfigured()) {
        const purchaseUserData = buildMetaUserDataFromStripeSession(fullSession, stripeCustomer);

        console.log("[meta/capi] Purchase payload", {
          sessionId: fullSession.id,
          value: purchaseValue,
          currency: purchaseCurrency,
          stripeFields: {
            customerEmail: Boolean(fullSession.customer_email),
            customerDetailsEmail: Boolean(fullSession.customer_details?.email),
            customerDetailsName: Boolean(fullSession.customer_details?.name),
            customerDetailsPhone: Boolean(fullSession.customer_details?.phone),
            billingCity: Boolean(fullSession.customer_details?.address?.city),
            billingState: Boolean(fullSession.customer_details?.address?.state),
            billingZip: Boolean(fullSession.customer_details?.address?.postal_code),
            billingCountry: Boolean(fullSession.customer_details?.address?.country),
            customerRecordEmail: Boolean(stripeCustomer?.email),
            customerRecordPhone: Boolean(stripeCustomer?.phone),
            customerRecordName: Boolean(stripeCustomer?.name),
            metaClientIp: Boolean(fullSession.metadata?.metaClientIp),
            metaFbc: Boolean(fullSession.metadata?.metaFbc),
            metaFbp: Boolean(fullSession.metadata?.metaFbp),
          },
          userDataFields: metaUserDataFieldCoverage(purchaseUserData),
        });

        await sendMetaServerEvents([
          {
            eventName: META_EVENT.Purchase,
            eventId: purchaseEventId(fullSession.id),
            eventSourceUrl: fullSession.metadata?.metaSourceUrl,
            userData: purchaseUserData,
            customData: {
              currency: purchaseCurrency,
              value: purchaseValue,
              contentName: "Profile Makeover Pro",
            },
          },
        ]);
      }

      if (isRedditCapiConfigured()) {
        const purchaseUserData = buildRedditUserDataFromStripeSession(fullSession, stripeCustomer);

        console.log("[reddit/capi] Purchase payload", {
          sessionId: fullSession.id,
          value: purchaseValue,
          currency: purchaseCurrency,
          conversionId: redditPurchaseEventId(fullSession.id),
          matchKeys: redditUserDataFieldCoverage(purchaseUserData),
        });

        await sendRedditServerEvents([
          {
            eventName: REDDIT_EVENT.Purchase,
            conversionId: redditPurchaseEventId(fullSession.id),
            eventSourceUrl: fullSession.metadata?.metaSourceUrl,
            userData: purchaseUserData,
            customData: {
              currency: purchaseCurrency,
              value: purchaseValue,
              itemCount: 1,
              products: [REDDIT_CONVERSION_PRODUCT],
            },
          },
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
