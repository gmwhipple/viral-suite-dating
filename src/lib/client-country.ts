import type { NextRequest } from "next/server";

/** Best-effort country from CDN / platform headers (ISO 3166-1 alpha-2). */
export function getClientCountry(request: NextRequest): string | null {
  const raw =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    request.headers.get("x-forwarded-country");

  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (!code || code === "XX" || code === "T1" || code.length !== 2) return null;
  return code;
}
