import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/auth";
import { getClientCountry } from "@/lib/client-country";
import { getCountryFromIp } from "@/lib/geo-ip";

function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value) return null;
  const code = value.trim().toUpperCase();
  if (code.length !== 2 || code === "XX" || code === "T1") return null;
  return code;
}

/**
 * Resolve visitor country: CDN header → explicit override → IP geolocation.
 * Replit often lacks cf-ipcountry unless the apex domain is Cloudflare-proxied.
 */
export async function resolveClientCountry(
  request: NextRequest,
  override?: string | null
): Promise<string | null> {
  const fromOverride = normalizeCountryCode(override);
  if (fromOverride) return fromOverride;

  const fromHeader = getClientCountry(request);
  if (fromHeader) return fromHeader;

  const fromIp = await getCountryFromIp(getClientIp(request));
  return fromIp;
}
