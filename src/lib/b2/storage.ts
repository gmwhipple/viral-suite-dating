import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function normalizeEndpoint(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

function getB2Config() {
  return {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID?.trim() || "",
    secretAccessKey: process.env.B2_APPLICATION_KEY?.trim() || "",
    bucket: process.env.B2_BUCKET?.trim() || "",
    region: process.env.B2_REGION?.trim() || "us-east-005",
    endpoint: normalizeEndpoint(process.env.B2_S3_ENDPOINT || ""),
  };
}

export function isB2StorageConfigured(): boolean {
  const { accessKeyId, secretAccessKey, bucket, endpoint } = getB2Config();
  return Boolean(accessKeyId && secretAccessKey && bucket && endpoint);
}

let client: S3Client | null = null;

function getB2Client(): S3Client {
  if (!client) {
    const { accessKeyId, secretAccessKey, region, endpoint } = getB2Config();
    if (!accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error("B2 storage is not configured");
    }
    client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }
  return client;
}

function getBucketName(): string {
  const bucket = getB2Config().bucket;
  if (!bucket) throw new Error("B2_BUCKET not configured");
  return bucket;
}

export async function uploadToB2Storage(
  storageKey: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  await getB2Client().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: storageKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function downloadFromB2Storage(storageKey: string): Promise<Buffer> {
  const response = await getB2Client().send(
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: storageKey,
    })
  );

  const bytes = await response.Body?.transformToByteArray();
  return Buffer.from(bytes || []);
}

export async function listB2StoragePrefix(prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await getB2Client().send(
      new ListObjectsV2Command({
        Bucket: getBucketName(),
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      })
    );

    for (const item of response.Contents || []) {
      if (item.Key && !item.Key.endsWith("/")) {
        keys.push(item.Key);
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

export async function existsInB2Storage(storageKey: string): Promise<boolean> {
  try {
    await getB2Client().send(
      new HeadObjectCommand({
        Bucket: getBucketName(),
        Key: storageKey,
      })
    );
    return true;
  } catch (err) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404) return false;
    console.log("[b2] head object error", storageKey, err instanceof Error ? err.message : err);
    return false;
  }
}

export async function deleteFromB2Storage(storageKey: string): Promise<void> {
  await getB2Client().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: storageKey,
    })
  );
}

/** Presigned HTTPS URL external APIs (Higgsfield, FAL) can fetch. Default 2 hours. */
export async function getB2PresignedReadUrl(
  storageKey: string,
  expiresSec = 2 * 60 * 60
): Promise<string> {
  return getSignedUrl(
    getB2Client(),
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: storageKey,
    }),
    { expiresIn: expiresSec }
  );
}
