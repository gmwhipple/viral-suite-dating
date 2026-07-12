/**
 * English (default) landing page copy.
 * Every user-facing string on the landing page lives here so new languages
 * can be added by creating a sibling file (e.g. `es.ts`) that satisfies
 * the same `Dictionary` shape and registering it in `src/lib/i18n/index.ts`.
 *
 * Strings may contain `{placeholders}`, filled at render time via `format()`.
 */
export const en = {
  nav: {
    results: "Results",
    pricing: "Pricing",
    faq: "FAQ",
    signIn: "Sign in",
    getStarted: "Get Started",
  },

  stickyCta: {
    label: "Get Started",
    sub: "One time payment · {photoCount} photos",
  },

  hero: {
    badge: "80% of dating profiles get ignored. Be the 20%",
    titleLine1: "Dating photos engineered",
    titleAccent: "for her eyes",
    titleAccentAlt: "for his eyes",
    titleLine2: "not your ego",
    subtitle:
      "Our proprietary AI studies what actually stops the swipe, then rebuilds your profile with candid, magazine grade photos that match your real life aesthetic. Zero plastic AI look. Zero noticeable artifacts",
    cta: "Transform My Profile",
    ctaSecondary: "See real results",
    ratingLabel: "rated by singles who stopped getting ignored",
  },

  trustBar: {
    label: "Trusted by singles winning on",
  },

  proof: {
    kicker: "The math is brutal",
    title: "You get one swipe to make her stop",
    titleAlt: "You get one swipe to make him stop",
    body: "80% of dating profiles get ignored, not because of the person, but because of the photos. The #1 advice from every dating coach is the same: fix your photos first. We trained our proprietary AI system to get rated as being attractive while still maintaining that candid look",
    stats: [
      {
        value: "75%",
        label: "of profiles get skipped in under a second",
      },
      {
        value: "10x",
        label: "improved quality of matches",
      },
      {
        value: "100+",
        label: "minutes saved every week from flakers and ghosters",
      },
    ],
  },

  beforeAfter: {
    kicker: "Real aesthetic. Zero artifacts",
    title: "Same face. Entirely different first impression",
    body: "Every reference in our catalog was hand picked because it performs 10x better on dating apps. Our proprietary AI maps them to your real life aesthetic, so the photos look like you on your best day, not a render of you",
    toggleForHim: "For him",
    toggleForHer: "For her",
    toggleHint: "Photos optimized for who you want to attract",
    beforeLabel: "Before",
    afterLabel: "After",
    meterLabel: "Swipe appeal",
    meterBeforeCaption: "Gets skipped",
    meterAfterCaption: "Gets messaged first, better dates more matches",
    disclaimer: "Transformations from clients we have worked with",
    examples: {
      him: [
        { beforeCaption: "Ghosting that is mentally draining" },
        {
          beforeCaption: "Conversations but lots of flakes",
          afterCaption: "Gets to choose who he flakes on",
        },
      ],
      her: [
        {
          beforeCaption: "Low effort dates",
          afterCaption: "Gets her dream man",
        },
        {
          beforeCaption: "Only gets low commitment dates",
          afterCaption: "Finds her soulmate",
        },
      ],
    },
  },

  gaze: {
    kicker: "The unfair advantage",
    titleHim: "Built for the female gaze",
    titleHer: "Built for the male gaze",
    body: "Guys shoot photos other guys think look cool. Women pick photos their friends like. Both are wrong. We reverse engineered what the people you're trying to attract actually respond to, candid framing, natural light, real environments, and trained our system on it",
    toggleForHim: "Men",
    toggleForHer: "Women",
    points: [
      {
        title: "Candid, not staged",
        body: "Photos that look like a talented friend caught you mid moment. That's what earns trust and replies",
      },
      {
        title: "Hand picked references",
        body: "Every one of our style references was selected because it statistically outperforms on dating apps. No filler, no generic AI portraits",
      },
      {
        title: "Your real aesthetic",
        body: "No waxy skin, no melted hands, no uncanny valley. If it doesn't pass as a real photo, it never reaches your gallery",
      },
    ],
  },

  profileBadge: {
    line1: "#1 dating profile",
    line2: "picture generator",
  },

  photoshoot: {
    kicker: "Do the math",
    title: "Infinitely superior to a {photographerPrice} photoshoot",
    body: "A photographer gives you one afternoon, one outfit, and photos that scream \u201cI hired a photographer for my dating profile.\u201d We give you an entire catalog of candid looks, living your best life, for a fraction of the price",
    themLabel: "Traditional photoshoot",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ for a single session",
        us: "One payment of {price}, that's it",
      },
      {
        them: "10 to 20 usable photos if you're lucky",
        us: "{photoCount} photos across proven styles",
      },
      {
        them: "One outfit, one location, one vibe",
        us: "Dozens of outfits, scenes, and moods",
      },
      {
        them: "Visibly posed and staged",
        us: "Candid, native to the feed aesthetic",
      },
      {
        them: "Weeks of scheduling and waiting",
        us: "Ready in hours, from your couch",
      },
      { them: "Reshoot? Pay again.", us: "100 AI edits included" },
    ],
    punchline:
      "Love is on the line. Don't leave it to a guy that's already been paid",
  },

  match: {
    kicker: "Where this ends",
    title: "Higher quality conversations start with the swipe",
    body: "More matches is just the beginning. When your photos finally show how interesting and confident you look, dates stop flaking, conversations open stronger, and \u201cyou look just like your pictures\u201d becomes a compliment, not a relief",
    imageAlt: "Tinder match screens showing It's a Match",
  },

  manifesto: {
    text: "Better photos mean better matches. It's as simple as that. The #1 advice that any dating guru will tell you is to get better dating headshots. Humans are visual creatures after all. We use cutting edge AI to make that process super affordable and as easy as 1 2 3",
    attribution: "Why we built {appName}",
  },

  steps: {
    kicker: "As easy as 1 2 3",
    title: "Your glow up, on autopilot",
    items: [
      {
        title: "Upload your selfies",
        body: "10+ everyday photos. Our AI learns your face from every angle",
      },
      {
        title: "AI builds your character",
        body: "A private model of you, trained once, reusable across every style",
      },
      {
        title: "Download {photoCount} photos",
        body: "Hand picked styles, watermark free, sized for every dating app",
      },
    ],
  },

  pricing: {
    kicker: "One payment. No subscription",
    title: "Cheaper than one bad first date",
    body: "You'll spend more on dates with low quality matches. Fix the photos once and your dating app experience will change forever",
    planName: "Profile Pictures",
    features: [
      "{photoCount} AI generated dating photos",
      "100 AI edits, for outfit changing, scenery adjustment or a better smile",
      "Over 200+ hand picked, high performing styles and scenes",
      "Optimized for the people you want to attract",
      "Watermark free, app ready downloads",
      "Private: your photos are never shared",
      "Priority processing",
    ],
    cta: "Get My Photos",
    guarantee: "Your training photos stay private and stored securely",
    payoff:
      "If one photo gets you one extra great date, it already paid for itself",
  },

  faq: {
    title: "Questions, answered",
    items: [
      {
        q: "Will the photos actually look like me?",
        a: "Yes. The AI trains on your real face from the selfies you upload and matches your real life aesthetic. No uncanny valley, no plastic skin. If a photo doesn't pass as real, regenerate it or fix it with an included AI edit",
      },
      {
        q: "How is this better than a professional photoshoot?",
        a: "A {photographerPrice} photoshoot buys you one outfit, one location, and visibly posed photos. You get an entire catalog of candid looks, living your best life, across dozens of scenes, plus AI edits, for a fraction of the price, without leaving home",
      },
      {
        q: "What do you mean by female gaze / male gaze optimized?",
        a: "Our style references were hand picked based on what the people you want to attract actually respond to, candid framing, natural settings, warm light, not what looks impressive to you. That's why they perform 10x better",
      },
      {
        q: "How fast do I get my photos?",
        a: "Training your private AI character takes about 20 to 45 minutes. After that, each photo generates in minutes. Most users have a full new profile the same day",
      },
      {
        q: "Can I edit tattoos, outfits, or backgrounds?",
        a: "Yes, every plan includes AI edits. Add or remove tattoos, swap clothing, remove objects, or clean up backgrounds by typing a sentence",
      },
      {
        q: "Is my data private?",
        a: "Your uploads and generated photos are private to your account. We never post, share, or train public models on your face, and you can request deletion anytime",
      },
      {
        q: "How long are my photos stored, and how long do credits last?",
        a: "Generated photos stay available in your gallery for 1 to 2 months. Credits are valid for a full year from purchase, so you have plenty of time to generate, edit, and download everything you need",
      },
    ],
  },

  finalCta: {
    title: "Be the profile that stops the scroll",
    body: "80% get ignored. The 20% got better photos. Which one do you want to be tonight?",
    cta: "Get Started",
  },

  footer: {
    tagline: "AI dating photos engineered to get you noticed",
    support: "Questions?",
    rights: "All rights reserved",
  },
};

/** Structural type all locales must satisfy. */
export type Dictionary = typeof en;
