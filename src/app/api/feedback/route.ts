import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/auth";
import { sendFeedbackEmail } from "@/lib/feedback-email";
import {
  isFeedbackPromptSeen,
  markFeedbackPromptSeen,
  saveFeedbackSubmission,
} from "@/lib/feedback-prompt-store";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const FEEDBACK_SEEN_COOKIE = "vs_feedback_seen";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function setSeenCookie(response: NextResponse): void {
  response.cookies.set(FEEDBACK_SEEN_COOKIE, "1", {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const fingerprint = request.nextUrl.searchParams.get("fingerprint")?.trim() || "";

  if (request.cookies.get(FEEDBACK_SEEN_COOKIE)?.value === "1") {
    return NextResponse.json({ eligible: false });
  }

  const rate = checkRateLimit(`feedback:eligibility:ip:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSec);

  const seen = await isFeedbackPromptSeen(ip, fingerprint);
  return NextResponse.json({ eligible: !seen });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rate = checkRateLimit(`feedback:submit:ip:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSec);

  const body = (await request.json()) as {
    action?: "submit" | "dismiss";
    message?: string;
    fingerprint?: string;
    locale?: string;
    pageUrl?: string;
  };

  const action = body.action === "submit" ? "submit" : "dismiss";
  const fingerprint = body.fingerprint?.trim() || "";
  const locale = body.locale?.trim() || "en";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";
  const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : undefined;

  if (action === "submit") {
    const emailSent = await sendFeedbackEmail({
      message,
      locale,
      fingerprint,
      ip,
      pageUrl,
    });

    await saveFeedbackSubmission({
      message,
      locale,
      fingerprint,
      ip,
      pageUrl,
      emailSent,
    });
  }

  await markFeedbackPromptSeen(ip, fingerprint, action === "submit" ? "submitted" : "dismissed");

  const response = NextResponse.json({ ok: true });
  setSeenCookie(response);
  return response;
}
