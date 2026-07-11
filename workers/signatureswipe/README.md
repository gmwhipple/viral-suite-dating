# Signature Swipe B2 CDN Worker

Serves Backblaze B2 images through Cloudflare's edge cache (Bandwidth Alliance = no B2 egress on cache hits).

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

## App config

In Replit Secrets (and local `.env`):

```
NEXT_PUBLIC_STORAGE_CDN_URL=https://cdn.signatureswipe.com
```

Then republish the Next.js app.

## Test

```bash
npm run dev
# open http://localhost:8787/references/men/your-file.jpg
```

After deploy:

```
https://cdn.signatureswipe.com/references/men/your-file.jpg
```
