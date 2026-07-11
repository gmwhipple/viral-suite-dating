import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { syncDashboardJobs } from "@/lib/services/job-sync";
import { isHiggsfieldConfigured } from "@/lib/higgsfield";
import { sanitizeSyncPayload } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";
import {
  DASHBOARD_SYNC_RATE_LIMIT_PER_IP,
  DASHBOARD_SYNC_RATE_LIMIT_PER_USER,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(
    `dashboard-sync:ip:${ip}`,
    DASHBOARD_SYNC_RATE_LIMIT_PER_IP,
    RATE_LIMIT_WINDOW_MS
  );
  if (!ipLimit.allowed) {
    return rateLimitResponse(ipLimit.retryAfterSec);
  }

  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userLimit = checkRateLimit(
    `dashboard-sync:uid:${auth.uid}`,
    DASHBOARD_SYNC_RATE_LIMIT_PER_USER,
    RATE_LIMIT_WINDOW_MS
  );
  if (!userLimit.allowed) {
    return rateLimitResponse(userLimit.retryAfterSec);
  }

  if (!isHiggsfieldConfigured()) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const result = await syncDashboardJobs(auth.uid);
    return NextResponse.json(sanitizeSyncPayload(result));
  } catch (err) {
    const message = toPublicErrorMessage(err, "Sync failed");
    console.log("[dashboard/sync] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
