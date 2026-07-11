import { getAdminDb, COLLECTIONS, isAdminConfigured, omitUndefined } from "@/lib/firebase/admin";
import type { ActivityLogEntry } from "@/lib/firebase/types";
import { v4 as uuidv4 } from "uuid";

export async function logActivity(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>,
  requestMeta?: { ip?: string; userAgent?: string }
): Promise<void> {
  if (!isAdminConfigured()) {
    console.log("[activity]", { userId, action, metadata });
    return;
  }

  const entry: ActivityLogEntry = {
    id: uuidv4(),
    userId,
    action,
    metadata,
    ip: requestMeta?.ip,
    userAgent: requestMeta?.userAgent,
    createdAt: new Date().toISOString(),
  };

  await getAdminDb()
    .collection(COLLECTIONS.activity)
    .doc(entry.id)
    .set(omitUndefined(entry));

  console.log("[activity]", action, userId, metadata ? JSON.stringify(metadata) : "");
}

export async function getUserActivity(
  userId: string,
  limit = 50
): Promise<ActivityLogEntry[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.activity)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((doc) => doc.data() as ActivityLogEntry);
}

export async function getAllRecentActivity(limit = 100): Promise<ActivityLogEntry[]> {
  if (!isAdminConfigured()) return [];

  const snap = await getAdminDb()
    .collection(COLLECTIONS.activity)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((doc) => doc.data() as ActivityLogEntry);
}
