type IpCountryCacheEntry = {
  country: string;
  expiresAt: number;
};

const ipCountryCache = new Map<string, IpCountryCacheEntry>();
const CACHE_TTL_MS = 60 * 60_000;

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "unknown") return true;
  if (ip === "::1" || ip.startsWith("127.")) return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  return false;
}

/** Fallback when CDN geo headers are absent (e.g. Replit without Cloudflare proxy). */
export async function getCountryFromIp(ip: string): Promise<string | null> {
  if (isPrivateIp(ip)) return null;

  const cached = ipCountryCache.get(ip);
  if (cached && cached.expiresAt > Date.now()) return cached.country;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    const json = (await response.json()) as {
      success?: boolean;
      country_code?: string;
    };

    if (!json.success || !json.country_code) return null;

    const country = json.country_code.trim().toUpperCase();
    if (country.length !== 2) return null;

    ipCountryCache.set(ip, { country, expiresAt: Date.now() + CACHE_TTL_MS });
    return country;
  } catch (err) {
    console.log("[geo-ip] lookup failed", ip, err instanceof Error ? err.message : err);
    return null;
  }
}
