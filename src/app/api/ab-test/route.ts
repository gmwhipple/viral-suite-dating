import { NextRequest, NextResponse } from "next/server";
import { assignVariant, trackABEvent, AB_TEST_COOKIE } from "@/lib/ab-testing";
import type { ABVariant } from "@/lib/ab-testing";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { event, sessionId, variant, userId } = body as {
    event: "view" | "cta_click" | "signup" | "purchase";
    sessionId?: string;
    variant?: ABVariant;
    userId?: string;
  };

  const sid = sessionId || uuidv4();
  const assignedVariant = variant || assignVariant(sid);

  await trackABEvent(assignedVariant, event, sid, userId);

  const response = NextResponse.json({ variant: assignedVariant, sessionId: sid });

  if (!request.cookies.get(AB_TEST_COOKIE)) {
    response.cookies.set(AB_TEST_COOKIE, assignedVariant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export async function GET(request: NextRequest) {
  const existing = request.cookies.get(AB_TEST_COOKIE)?.value as ABVariant | undefined;
  const sessionId = request.cookies.get("vs_session")?.value || uuidv4();
  const variant = existing === "A" || existing === "B" ? existing : assignVariant(sessionId);

  const response = NextResponse.json({ variant, sessionId });

  if (!existing) {
    response.cookies.set(AB_TEST_COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  if (!request.cookies.get("vs_session")) {
    response.cookies.set("vs_session", sessionId, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  await trackABEvent(variant, "view", sessionId);

  return response;
}
