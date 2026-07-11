import { promises as fs } from "fs";
import path from "path";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import {
  getB2Client,
  getBucketName,
  isB2StorageConfigured,
} from "@/lib/b2/storage";
import { isFirebaseStorageConfigured, getAdminBucket } from "@/lib/firebase/storage";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");

export interface ListedStorageObject {
  storageKey: string;
  size: number;
  lastModified: string;
}

export async function listStorageObjectsWithMeta(
  prefix: string
): Promise<ListedStorageObject[]> {
  if (isB2StorageConfigured()) {
    const objects: ListedStorageObject[] = [];
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
        if (!item.Key || item.Key.endsWith("/")) continue;
        objects.push({
          storageKey: item.Key,
          size: item.Size || 0,
          lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
        });
      }

      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return objects;
  }

  if (isFirebaseStorageConfigured()) {
    const [files] = await getAdminBucket().getFiles({ prefix, maxResults: 1000 });
    return files.map((file) => ({
      storageKey: file.name,
      size: Number(file.metadata?.size || 0),
      lastModified:
        (file.metadata?.updated as string) ||
        (file.metadata?.timeCreated as string) ||
        new Date().toISOString(),
    }));
  }

  const dir = path.join(LOCAL_STORAGE_DIR, prefix);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const objects: ListedStorageObject[] = [];

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const storageKey = `${prefix}${entry.name}`;
      const stat = await fs.stat(path.join(dir, entry.name));
      objects.push({
        storageKey,
        size: stat.size,
        lastModified: stat.mtime.toISOString(),
      });
    }

    return objects;
  } catch {
    return [];
  }
}
