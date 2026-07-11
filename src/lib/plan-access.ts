import { TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import type { UserProfile } from "@/lib/firebase/types";

export function userHasPaidAccess(plan: UserProfile["plan"]): boolean {
  return TESTING_BYPASS_PAYMENT || plan === "paid";
}

/** Catalog references — only true paid plan unlocks the full library. */
export function userHasCatalogAccess(plan: UserProfile["plan"]): boolean {
  return plan === "paid";
}
