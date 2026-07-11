import { listSoulStyles, type SoulStyle } from "@/lib/higgsfield";

/** Higgsfield Soul preset for candid smartphone-style photos. */
export const SOUL_PROMPT_ONLY_STYLE_NAME = "iPhone";

/** Stable fallback ID from Higgsfield's soul-styles catalog. */
export const SOUL_IPHONE_STYLE_ID_FALLBACK = "1b798b54-03da-446a-93bf-12fcba1050d7";

export interface ResolvedSoulStyle {
  id: string;
  name: string;
}

let cachedPromptOnlyStyle: ResolvedSoulStyle | null = null;

function matchIphoneStyle(styles: SoulStyle[]): ResolvedSoulStyle | null {
  const iphone = styles.find((style) => style.name.trim().toLowerCase() === "iphone");
  if (!iphone) return null;
  return { id: iphone.id, name: iphone.name };
}

/**
 * Resolve the default Soul style for prompt-only generations (no reference image).
 * Priority: SOUL_PROMPT_ONLY_STYLE_ID env → live API lookup by name → hardcoded fallback.
 */
export async function resolvePromptOnlySoulStyle(): Promise<ResolvedSoulStyle> {
  if (cachedPromptOnlyStyle) return cachedPromptOnlyStyle;

  const envId = process.env.SOUL_PROMPT_ONLY_STYLE_ID?.trim();
  if (envId) {
    cachedPromptOnlyStyle = { id: envId, name: SOUL_PROMPT_ONLY_STYLE_NAME };
    console.log("[soul-default-style] using env override", { styleId: envId });
    return cachedPromptOnlyStyle;
  }

  try {
    const styles = await listSoulStyles();
    const matched = matchIphoneStyle(styles);
    if (matched) {
      cachedPromptOnlyStyle = matched;
      console.log("[soul-default-style] resolved from API", matched);
      return matched;
    }
    console.log("[soul-default-style] iPhone not found in API list, using fallback ID");
  } catch (err) {
    const message = err instanceof Error ? err.message : "style lookup failed";
    console.log("[soul-default-style] API lookup failed, using fallback", message);
  }

  cachedPromptOnlyStyle = {
    id: SOUL_IPHONE_STYLE_ID_FALLBACK,
    name: SOUL_PROMPT_ONLY_STYLE_NAME,
  };
  return cachedPromptOnlyStyle;
}
