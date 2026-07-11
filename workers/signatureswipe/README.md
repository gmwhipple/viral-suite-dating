# Signature Swipe B2 CDN Worker

Serves Backblaze B2 images through Cloudflare's edge cache (Bandwidth Alliance = no B2 egress on cache hits).

**Cache TTL: 1 year** (browser + Cloudflare edge + `caches.default`).

## One-time setup

```bash
cd workers/signatureswipe
npm install
npx wrangler login
```

Set secrets (from your B2 application key — never commit these):

```bash
npx wrangler secret put B2_APPLICATION_KEY_ID
npx wrangler secret put B2_APPLICATION_KEY
```

`B2_BUCKET`, `B2_S3_ENDPOINT`, and `B2_REGION` are already in `wrangler.jsonc`.

## Deploy

```bash
npm run deploy
```

Or from repo root:

```bash
npm run worker:deploy
```

## DNS setup (Cloudflare dashboard)

`signatureswipe.com` must already be on Cloudflare (orange cloud). Then:

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **signatureswipe.com** → **DNS** → **Records**
2. Click **Add record**
3. Use **either** option:

### Option A — AAAA (recommended for Worker-only CDN subdomain)

| Field | Value |
|-------|--------|
| Type | `AAAA` |
| Name | `cdn` |
| IPv6 address | `100::` |
| Proxy status | **Proxied** (orange cloud ON) |
| TTL | Auto |

### Option B — CNAME

| Field | Value |
|-------|--------|
| Type | `CNAME` |
| Name | `cdn` |
| Target | `signatureswipe.com` |
| Proxy status | **Proxied** (orange cloud ON) |
| TTL | Auto |

4. Save the record
5. Deploy the worker (`npm run deploy`) — `wrangler.jsonc` already routes `cdn.signatureswipe.com/*` to this worker
6. Wait 1–5 minutes for DNS to propagate

**Verify DNS:**

```bash
dig cdn.signatureswipe.com
# Should show Cloudflare IPs (104.x or 172.x) when proxied
```

**Verify cache headers:**

```bash
curl -I https://cdn.signatureswipe.com/references/men/SOME-FILE.jpg
# Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable
# Second request: cf-cache-status: HIT
```

## App config

In Replit Secrets (and local `.env`):

```
NEXT_PUBLIC_STORAGE_CDN_URL=https://cdn.signatureswipe.com
```

Then republish the Next.js app.

## Local dev

```bash
npm run dev
# http://localhost:8787/references/men/your-file.jpg
```
