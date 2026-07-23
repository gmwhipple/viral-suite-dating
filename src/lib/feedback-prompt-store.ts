import { getAdminDb, isAdminConfigured, omitUndefined } from "@/lib/firebase/admin";
import { createHash } from "node:crypto";

const COLLECTION = "feedback_prompt_seen";
const SUBMISSIONS = "feedback_submissions";

function hashKey(prefix: string, value: string): string {
  const digest = createHash("sha256").update(value).digest("hex").slice(0, 24);
  return `${prefix}_${digest}`;
}

export async function isFeedbackPromptSeen(
  ip: string,
  fingerprint: string
): Promise<boolean> {
  if (!isAdminConfigured()) return false;

  const db = getAdminDb();
  const ids = [
    hashKey("ip", ip),
    fingerprint ? hashKey("fp", fingerprint) : null,
  ].filter(Boolean) as string[];

  if (!ids.length) return false;

  const refs = ids.map((id) => db.collection(COLLECTION).doc(id));
  const snaps = await db.getAll(...refs);
  return snaps.some((snap) => snap.exists);
}

export async function markFeedbackPromptSeen(
  ip: string,
  fingerprint: string,
  reason: "dismissed" | "submitted"
): Promise<void> {
  if (!isAdminConfigured()) return;

  const db = getAdminDb();
  const now = new Date();
  const batch = db.batch();

  const ipDoc = db.collection(COLLECTION).doc(hashKey("ip", ip));
  batch.set(
    ipDoc,
    omitUndefined({
      type: "ip",
      reason,
      seenAt: now,
      fingerprint: fingerprint || undefined,
    }),
    { merge: true }
  );

  if (fingerprint) {
    const fpDoc = db.collection(COLLECTION).doc(hashKey("fp", fingerprint));
    batch.set(
      fpDoc,
      omitUndefined({
        type: "fingerprint",
        reason,
        seenAt: now,
        ipHash: hashKey("ip", ip),
      }),
      { merge: true }
    );
  }

  await batch.commit();
}

export async function saveFeedbackSubmission(params: {
  message: string;
  locale: string;
  fingerprint: string;
  ip: string;
  pageUrl?: string;
  emailSent: boolean;
}): Promise<void> {
  if (!isAdminConfigured()) return;

  const db = getAdminDb();
  await db.collection(SUBMISSIONS).add(
    omitUndefined({
      message: params.message,
      locale: params.locale,
      fingerprint: params.fingerprint,
      ip: params.ip,
      pageUrl: params.pageUrl,
      emailSent: params.emailSent,
      createdAt: new Date(),
    })
  );
}
