const VISITOR_FP_KEY = "vs_visitor_fp";
const FEEDBACK_SEEN_KEY = "vs_feedback_prompt_seen";

/** Stable per-browser visitor id (persisted in localStorage). */
export function getOrCreateVisitorFingerprint(): string {
  if (typeof window === "undefined") return "";

  try {
    const existing = localStorage.getItem(VISITOR_FP_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `fp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(VISITOR_FP_KEY, id);
    return id;
  } catch {
    return `fp_${Date.now().toString(36)}`;
  }
}

export function hasSeenFeedbackPromptLocally(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(FEEDBACK_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markFeedbackPromptSeenLocally(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FEEDBACK_SEEN_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}
