import type { NextRequest } from "next/server";

type HeaderSource = Pick<NextRequest, "headers"> | Headers | null | undefined;

function readHeaders(source: HeaderSource): Headers | null {
  if (!source) return null;
  if (source instanceof Headers) return source;
  return source.headers;
}

/**
 * Resolve the public app URL for the current request/environment.
 * Prefers live request host (localhost vs Replit) over static env.
 */
export function getAppBaseUrl(source?: HeaderSource): string {
  const headers = readHeaders(source ?? null);

  if (headers) {
    const host =
      headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      headers.get("host")?.split(",")[0]?.trim();

    if (host && host !== "0.0.0.0") {
      const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
      const isLocal = host.includes("localhost") || host.startsWith("127.0.0.1");
      const proto = forwardedProto || (isLocal ? "http" : "https");
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`.replace(/\/$/, "");
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (envUrl) return envUrl;

  return "http://localhost:3000";
}
