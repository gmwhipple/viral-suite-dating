const PROVIDER_PATTERNS: RegExp[] = [
  /higgsfield/gi,
  /platform\.higgsfield\.ai/gi,
  /@higgsfield/gi,
  /\bfal\b/gi,
  /fal-ai/gi,
  /nano-banana/gi,
  /ailab/gi,
  /ailabapi/gi,
  /openrouter/gi,
  /soul[\s-]?2\.?0/gi,
  /\bsoul\b/gi,
  /custom-reference/gi,
  /text2image/gi,
];

export function toPublicErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : fallback;
  let sanitized = raw;
  for (const pattern of PROVIDER_PATTERNS) {
    sanitized = sanitized.replace(pattern, "AI service");
  }
  sanitized = sanitized.replace(/\s{2,}/g, " ").trim();

  if (!sanitized || sanitized.length < 4) return fallback;
  return sanitized;
}
