import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { getUserActivity, getAllRecentActivity } from "@/lib/activity-log";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";

  if (admin) {
    const activity = await getAllRecentActivity(200);
    return NextResponse.json({ activity });
  }

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activity = await getUserActivity(auth.uid, 100);
  return NextResponse.json({ activity });
}
