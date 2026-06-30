import { NextRequest } from "next/server";
import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";

export async function verifyAuthToken(
  request: NextRequest
): Promise<{ uid: string; email: string } | null> {
  if (!isAdminConfigured()) {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || "",
    };
  } catch {
    return null;
  }
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
