import { AB_TEST_COOKIE } from "@/lib/constants";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import type { ABTestEvent } from "@/lib/firebase/types";
import { v4 as uuidv4 } from "uuid";

export type ABVariant = "A" | "B";

export function assignVariant(sessionId: string): ABVariant {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash << 5) - hash + sessionId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0 ? "A" : "B";
}

export async function trackABEvent(
  variant: ABVariant,
  event: ABTestEvent["event"],
  sessionId: string,
  userId?: string
): Promise<void> {
  const entry: ABTestEvent = {
    id: uuidv4(),
    variant,
    event,
    sessionId,
    userId,
    createdAt: new Date().toISOString(),
  };

  if (!isAdminConfigured()) {
    console.log("[ab-test]", entry);
    return;
  }

  await getAdminDb().collection(COLLECTIONS.abTests).doc(entry.id).set(entry);
}

export function getVariantFromCookie(cookieValue?: string): ABVariant | null {
  if (cookieValue === "A" || cookieValue === "B") return cookieValue;
  return null;
}

export { AB_TEST_COOKIE };
