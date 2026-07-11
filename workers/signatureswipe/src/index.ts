import { AwsClient } from "aws4fetch";

/** 1 year — matches app STORAGE_IMAGE_CACHE_SECONDS */
const CACHE_TTL_SECONDS = 365 * 24 * 60 * 60;
const CACHE_CONTROL = `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, immutable`;

export interface Env {
  B2_APPLICATION_KEY_ID: string;
  B2_APPLICATION_KEY: string;
  B2_BUCKET: string;
  B2_S3_ENDPOINT: string;
  B2_REGION?: string;
}

function encodeKey(storageKey: string): string {
  return storageKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function decodeKey(pathname: string): string | null {
  const trimmed = pathname.replace(/^\//, "");
  if (!trimmed) return null;
  return trimmed
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

function contentTypeForKey(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: request.method });
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const url = new URL(request.url);
    const storageKey = decodeKey(url.pathname);
    if (!storageKey) {
      return new Response("Missing object key", { status: 400 });
    }

    const endpoint = (env.B2_S3_ENDPOINT || "").replace(/\/$/, "");
    const bucket = env.B2_BUCKET;
    if (!endpoint || !bucket || !env.B2_APPLICATION_KEY_ID || !env.B2_APPLICATION_KEY) {
      return new Response("B2 CDN worker not configured", { status: 503 });
    }

    const objectUrl = `${endpoint}/${bucket}/${encodeKey(storageKey)}`;
    const client = new AwsClient({
      accessKeyId: env.B2_APPLICATION_KEY_ID,
      secretAccessKey: env.B2_APPLICATION_KEY,
      service: "s3",
      region: env.B2_REGION || "us-east-005",
    });

    const signedRequest = await client.sign(objectUrl, { method: request.method });
    const originResponse = await fetch(signedRequest);

    if (!originResponse.ok) {
      return new Response("Not found", { status: originResponse.status });
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      originResponse.headers.get("Content-Type") || contentTypeForKey(storageKey)
    );
    headers.set("Cache-Control", CACHE_CONTROL);
    headers.set("CDN-Cache-Control", `max-age=${CACHE_TTL_SECONDS}`);

    const response = new Response(request.method === "HEAD" ? null : originResponse.body, {
      status: originResponse.status,
      headers,
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
} satisfies ExportedHandler<Env>;
