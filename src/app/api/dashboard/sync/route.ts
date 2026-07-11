import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { syncDashboardJobs } from "@/lib/services/job-sync";
import { isHiggsfieldConfigured } from "@/lib/higgsfield";
import { sanitizeSyncPayload } from "@/lib/client-sanitize";
import { toPublicErrorMessage } from "@/lib/public-errors";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
