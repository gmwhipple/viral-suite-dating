import { getAdminAuth, getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { activatePaidPlan } from "@/lib/services/users";
import { logActivity } from "@/lib/activity-log";

export interface PendingPurchase {
  email: string;
  stripeCustomerId: string;
  sessionId: string;
  createdAt: string;
  claimedBy?: string;
  claimedAt?: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function resolveUserIdByEmail(email: string): Promise<string | null> {
  if (!isAdminConfigured()) return null;

  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  try {
    const authUser = await getAdminAuth().getUserByEmail(normalized);
    console.log("[pending-purchases] resolved existing auth user", {
      email: normalized,
      uid: authUser.uid.slice(0, 8),
    });
    return authUser.uid;
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
    if (code === "auth/user-not-found") return null;
    throw err;
  }
}

export async function storePendingPurchase(params: {
  email: string;
  stripeCustomerId: string;
  sessionId: string;
}): Promise<void> {
  if (!isAdminConfigured()) {
    console.log("[pending-purchases] store skipped — admin not configured", params.sessionId);
    return;
  }

  const email = normalizeEmail(params.email);
  const record: PendingPurchase = {
    email,
    stripeCustomerId: params.stripeCustomerId,
    sessionId: params.sessionId,
    createdAt: new Date().toISOString(),
  };

  await getAdminDb().collection(COLLECTIONS.pendingPurchases).doc(email).set(record);
  console.log("[pending-purchases] stored pending purchase", {
    email,
    sessionId: params.sessionId,
  });
}

export async function claimPendingPurchase(email: string, uid: string): Promise<boolean> {
  if (!isAdminConfigured()) return false;

  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  const ref = getAdminDb().collection(COLLECTIONS.pendingPurchases).doc(normalized);
  const snap = await ref.get();
  if (!snap.exists) return false;

  const pending = snap.data() as PendingPurchase;
  if (pending.claimedBy) return false;

  await activatePaidPlan(uid, pending.stripeCustomerId);
  await ref.update({
    claimedBy: uid,
    claimedAt: new Date().toISOString(),
  });
  await logActivity(uid, "pending_purchase_claimed", {
    sessionId: pending.sessionId,
    email: normalized,
  });
  console.log("[pending-purchases] claimed pending purchase", {
    email: normalized,
    uid: uid.slice(0, 8),
    sessionId: pending.sessionId,
  });
  return true;
}
