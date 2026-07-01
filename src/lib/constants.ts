export const APP_NAME = "Viral Suite Dating";
export const SUPPORT_EMAIL = "contact@viral-suite.com";
export const MAX_UPLOAD_PHOTOS = 100;
export const MAX_GENERATIONS_PER_USER = 100;
export const MIN_SOUL_TRAINING_PHOTOS = 5;

/** Set to false before launch — skips Stripe / paid-plan checks for testing. */
export const TESTING_BYPASS_PAYMENT = true;

export const AB_TEST_COOKIE = "vs_ab_variant";
export const DEFAULT_SOUL_GENERATION_PROMPT =
  "Professional dating profile photo, photorealistic, flattering natural lighting, confident expression, high quality portrait";

export const SMILE_OPTIONS = [
  { label: "Dimple Smile", serviceChoice: 11 },
  { label: "Big Smile", serviceChoice: 12 },
  { label: "Standard Smile", serviceChoice: 13 },
] as const;

export const REFERENCE_CATALOG_PATHS = {
  men: "references/men/",
  women: "references/women/",
} as const;

export const PRICING = {
  name: "Profile Makeover Pro",
  price: 49,
  currency: "usd",
  description: "100 AI dating photos + unlimited edits",
  features: [
    "Upload up to 100 training photos",
    "100 AI-generated dating profile shots",
    "Choose from 100 style references",
    "AI edits (outfit swaps, object removal)",
    "Watermark-free downloads",
    "Priority processing",
  ],
};

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
