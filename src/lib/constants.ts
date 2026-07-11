export const APP_NAME = "Signature Swipe";
export const SUPPORT_EMAIL = "contact@viral-suite.com";
export const MAX_UPLOAD_PHOTOS = 100;
export const MAX_GENERATIONS_PER_USER = 200;
export const MAX_EDITS_PER_USER = 100;
export const MIN_SOUL_TRAINING_PHOTOS = 5;
/** Training quality tiers shown in the upload meter */
export const TRAINING_QUALITY_EXCELLENT_MIN = 25;
export const TRAINING_QUALITY_GOOD_MIN = 10;
export const TRAINING_LOW_PHOTO_WARNING_THRESHOLD = 10;
export const SKIN_RETEXTURE_EDIT_PROMPT =
  "retexturize my skin so it looks less plastic and perfect, add pores and such";
export const TRAINING_PHOTO_RETENTION_DAYS = 180;
/** Generations loaded on dashboard (gallery); pending jobs sync separately */
export const DASHBOARD_GALLERY_LIMIT = 48;
/** Poll training/generation status only while work is in flight */
export const DASHBOARD_ACTIVE_POLL_MS = 90_000;

/** Set to false before launch — skips Stripe / paid-plan checks for testing. */
export const TESTING_BYPASS_PAYMENT = true;

/** 1 year — B2 objects are immutable per key; long TTL keeps Cloudflare edge hot. */
export const STORAGE_IMAGE_CACHE_SECONDS = 365 * 24 * 60 * 60;

export const STORAGE_IMAGE_CACHE_CONTROL = `public, max-age=${STORAGE_IMAGE_CACHE_SECONDS}, s-maxage=${STORAGE_IMAGE_CACHE_SECONDS}, immutable`;

export const AB_TEST_COOKIE = "vs_ab_variant";
export const DEFAULT_SOUL_GENERATION_PROMPT =
  "Professional dating profile photo, photorealistic, flattering natural lighting, confident expression, high quality portrait";

export const SOUL_SUBJECT_REPLACEMENT_INSTRUCTION =
  "Make sure only the main subject should be replaced with the character";

export function withSoulSubjectInstruction(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return SOUL_SUBJECT_REPLACEMENT_INSTRUCTION;
  if (trimmed.toLowerCase().includes(SOUL_SUBJECT_REPLACEMENT_INSTRUCTION.toLowerCase())) {
    return trimmed;
  }
  return `${trimmed}. ${SOUL_SUBJECT_REPLACEMENT_INSTRUCTION}`;
}

export const GENERATION_PROMPT_PLACEHOLDER =
  "remove the drink from their hand, remove their tattoos, have the main subject look a bit shorter";

export const SMILE_OPTIONS = [
  { label: "Dimple Smile", serviceChoice: 11 },
  { label: "Big Smile", serviceChoice: 12 },
  { label: "Standard Smile", serviceChoice: 13 },
] as const;

export const REFERENCE_CATALOG_PATHS = {
  men: "references/men/",
  women: "references/women/",
} as const;

/** Free accounts can browse/use this many catalog style references per gender. */
export const FREE_CATALOG_REFERENCE_LIMIT = 10;

export const PRICING = {
  name: "Profile Makeover Pro",
  price: 199,
  currency: "usd",
  description: "200 AI dating photos + 100 AI edits",
  features: [
    "Upload up to 100 training photos",
    "200 AI-generated dating profile shots",
    "100 AI edits with reference photos",
    "Choose from 100 style references",
    "AI edits (outfit swaps, object removal)",
    "Watermark-free downloads",
    "Priority processing",
  ],
};

export const GENERATION_PROMPT_PRESETS = [
  {
    id: "professional",
    label: "Professional portrait",
    prompt:
      "Professional dating profile photo, photorealistic, flattering natural lighting, confident expression, high quality portrait",
  },
  {
    id: "outdoor",
    label: "Outdoor casual",
    prompt:
      "Outdoor casual dating profile photo, natural daylight, relaxed confident smile, lifestyle portrait, photorealistic",
  },
  {
    id: "evening",
    label: "Evening date",
    prompt:
      "Smart evening date outfit, warm ambient lighting, confident approachable expression, photorealistic dating portrait",
  },
  {
    id: "coffee",
    label: "Coffee shop",
    prompt:
      "Coffee shop casual dating photo, soft window light, friendly natural expression, photorealistic portrait",
  },
] as const;

export const EXAMPLE_GOOD_PHOTOS = [
  {
    id: "good-1",
    title: "Clear face, good lighting",
    description: "Front-facing, natural light, no sunglasses",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  },
  {
    id: "good-2",
    title: "Variety of angles",
    description: "Mix of close-ups and medium shots",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  },
  {
    id: "good-3",
    title: "Different outfits",
    description: "Casual, smart casual, and outdoor looks",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
  },
  {
    id: "good-4",
    title: "Natural expressions",
    description: "Smiling and neutral — both work well",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
  },
];

export const EXAMPLE_BAD_PHOTOS = [
  {
    id: "bad-1",
    title: "Sunglasses or face covered",
    description: "AI can't learn your face if it's hidden",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
  },
  {
    id: "bad-2",
    title: "Group photos",
    description: "Only upload photos of yourself alone",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
  },
  {
    id: "bad-3",
    title: "Blurry or dark",
    description: "Low quality photos reduce result quality",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=500&fit=crop",
  },
  {
    id: "bad-4",
    title: "Heavy filters",
    description: "Avoid Snapchat/Instagram filters",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  },
];
