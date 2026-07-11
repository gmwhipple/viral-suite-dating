"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Lock,
  MessageCircleHeart,
  ScanFace,
  Star,
  X,
} from "lucide-react";
import {
  APP_NAME,
  MAX_EDITS_PER_USER,
  MAX_GENERATIONS_PER_USER,
  SUPPORT_EMAIL,
} from "@/lib/constants";
import { format, type Dictionary } from "@/lib/i18n";
import { useTranslations } from "@/hooks/useTranslations";
import { useLocalizedPricing } from "@/hooks/useLocalizedPricing";
import { useGuestCheckout } from "@/hooks/useGuestCheckout";
import { LanguagePicker } from "@/components/landing/LanguagePicker";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onCtaClick: () => void;
}

/** Who the visitor wants to attract — drives gaze-optimized copy + examples. */
type Audience = "him" | "her";

/* ------------------------------------------------------------------ */
/* PLACEHOLDER MEDIA — swap these URLs for your real before/afters.    */
/* Scores drive the swipe-appeal meter under each photo (0–10).        */
/* ------------------------------------------------------------------ */
const BEFORE_AFTER_EXAMPLES: Record<
  Audience,
  {
    id: string;
    before: string;
    after: string;
    beforeScore: number;
    afterScore: number;
  }[]
> = {
  him: [
    {
      id: "him-1",
      before: "/landing/before-after/men-1-before.png",
      after: "/landing/before-after/men-1-after.png",
      beforeScore: 4.1,
      afterScore: 9.2,
    },
    {
      id: "him-2",
      before: "/landing/before-after/men-2-before.png",
      after: "/landing/before-after/men-2-after.png",
      beforeScore: 6.8,
      afterScore: 9.4,
    },
  ],
  her: [
    {
      id: "her-1",
      before: "/landing/before-after/women-1-before.png",
      after: "/landing/before-after/women-1-after.png",
      beforeScore: 7.3,
      afterScore: 9.5,
    },
    {
      id: "her-2",
      before: "/landing/before-after/women-2-before.png",
      after: "/landing/before-after/women-2-after.png",
      beforeScore: 4.6,
      afterScore: 9.1,
    },
  ],
};

/** "It's a MATCH!" artwork — localized per locale in /public/landing/match-localized */
const MATCH_IMAGE = { src: "/landing/its-a-match.png", width: 909, height: 1024 };

function getLocalizedMatchImage(locale: string) {
  if (!locale || locale === "en") return MATCH_IMAGE;
  return {
    src: `/landing/match-localized/${locale}.png`,
    width: MATCH_IMAGE.width,
    height: MATCH_IMAGE.height,
  };
}

const GAZE_EXAMPLES: Record<Audience, string[]> = {
  him: [
    "/landing/gaze/men-1.png",
    "/landing/gaze/men-2.png",
    "/landing/gaze/men-3.png",
    "/landing/gaze/men-4.png",
  ],
  her: [
    "/landing/gaze/women-1.png",
    "/landing/gaze/women-2.png",
    "/landing/gaze/women-3.png",
    "/landing/gaze/women-4.png",
  ],
};

const DATING_APPS = [
  "Tinder",
  "Hinge",
  "Bumble",
  "OkCupid",
  "Match",
  "Badoo",
  "Raya",
  "The League",
];

const ACCENT = "text-rose-500";
const ACCENT_BG = "bg-rose-500";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-rose-500 text-white font-semibold uppercase tracking-[0.12em] transition hover:bg-rose-600";
const CTA_GHOST =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 text-white font-semibold uppercase tracking-[0.12em] transition hover:border-white/50";

function CheckoutButton({
  label,
  className,
  onCheckout,
  checkingOut,
  disabled,
  children,
}: {
  label: string;
  className?: string;
  onCheckout: () => void;
  checkingOut?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onCheckout}
      disabled={checkingOut || disabled}
      className={cn(className, (checkingOut || disabled) && "opacity-70")}
    >
      {checkingOut ? "Loading..." : label}
      {!checkingOut && children}
    </button>
  );
}

export function LandingPage({ onCtaClick }: LandingPageProps) {
  const { t, locale, setLocale } = useTranslations();
  const { prices } = useLocalizedPricing(locale);
  const { startCheckout, checkingOut, checkoutError, checkoutBlocked } = useGuestCheckout(
    locale,
    prices.productAmount,
    prices.currency.toUpperCase()
  );
  const [audience, setAudience] = useState<Audience>("him");
  const photoCount = MAX_GENERATIONS_PER_USER;
  const editCount = MAX_EDITS_PER_USER;

  const handleCheckout = () => startCheckout(onCtaClick);

  const priceValues = {
    appName: APP_NAME,
    price: prices.productLabel,
    photographerPrice: prices.photographerLabel,
    photoCount,
    editCount,
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-white selection:text-black">
      <FloatingNav
        t={t}
        locale={locale}
        onLocaleChange={setLocale}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
        checkoutBlocked={checkoutBlocked}
      />

      {checkoutError && (
        <div className="fixed inset-x-0 top-20 z-[60] mx-auto max-w-lg px-4">
          <p className="rounded-xl border border-rose-500/30 bg-rose-950/90 px-4 py-3 text-center text-sm text-rose-200">
            {checkoutError}
          </p>
        </div>
      )}

      <main>
        <Hero
          t={t}
          audience={audience}
          onAudienceChange={setAudience}
          onCheckout={handleCheckout}
          checkingOut={checkingOut}
          checkoutBlocked={checkoutBlocked}
        />
        <BeforeAfterSection t={t} audience={audience} onAudienceChange={setAudience} />
        <TrustMarquee t={t} />
        <ProofSection t={t} audience={audience} />
        <GazeSection t={t} />
        <PhotoshootComparison t={t} priceValues={priceValues} />
        <MatchSection t={t} locale={locale} />
        <Manifesto t={t} />
        <StepsSection t={t} photoCount={photoCount} />
        <PricingSection
          t={t}
          onCheckout={handleCheckout}
          checkingOut={checkingOut}
          checkoutBlocked={checkoutBlocked}
          photoCount={photoCount}
          editCount={editCount}
          priceLabel={prices.productLabel}
        />
        <FAQSection t={t} priceValues={priceValues} />
        <FinalCta
          t={t}
          onCheckout={handleCheckout}
          checkingOut={checkingOut}
          checkoutBlocked={checkoutBlocked}
        />
      </main>

      <Footer t={t} />
      <StickyCta t={t} photoCount={photoCount} />
    </div>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function FloatingNav({
  t,
  locale,
  onLocaleChange,
  onCheckout,
  checkingOut,
  checkoutBlocked,
}: {
  t: Dictionary;
  locale: string;
  onLocaleChange: (locale: string) => void;
  onCheckout: () => void;
  checkingOut?: boolean;
  checkoutBlocked?: boolean;
}) {
  const links = [
    { href: "#results", label: t.nav.results },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/60 py-2.5 pl-6 pr-2.5 backdrop-blur-2xl">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.2em]"
        >
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-zinc-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguagePicker locale={locale} onLocaleChange={onLocaleChange} />
          <Link
            href="/login"
            className="hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-zinc-400 transition hover:text-white md:block"
          >
            {t.nav.signIn}
          </Link>
          <CheckoutButton
            label={t.nav.getStarted}
            onCheckout={onCheckout}
            checkingOut={checkingOut}
            disabled={checkoutBlocked}
            className={cn(CTA_PRIMARY, "whitespace-nowrap px-5 py-2.5 text-xs")}
          />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- Sticky CTA ------------------------------ */

function StickyCta({ t, photoCount }: { t: Dictionary; photoCount: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const pricing = document.getElementById("pricing");
    if (!hero || !pricing) return;

    let heroInView = true;
    let pricingInView = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) heroInView = entry.isIntersecting;
          if (entry.target === pricing) pricingInView = entry.isIntersecting;
        }
        setVisible(!heroInView && !pricingInView);
      },
      { threshold: 0.15 }
    );
    observer.observe(hero);
    observer.observe(pricing);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 px-4 pb-4 transition-all duration-300 sm:px-6 sm:pb-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-3xl border border-white/10 bg-black/80 p-3 backdrop-blur-2xl">
        <a href="#pricing" className={cn(CTA_PRIMARY, "w-full py-4 text-sm")}>
          {t.stickyCta.label}
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          <RatingStars compact />
          {format(t.stickyCta.sub, { photoCount })}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- Shared elements ---------------------------- */

function AudienceToggle({
  t,
  audience,
  onAudienceChange,
  className,
}: {
  t: Dictionary;
  audience: Audience;
  onAudienceChange: (a: Audience) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2.5", className)}>
      <div className="inline-flex rounded-full border border-white/15 p-1">
        {(["him", "her"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onAudienceChange(a)}
            className={cn(
              "rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition",
              audience === a ? "bg-white text-black" : "text-zinc-500 hover:text-white"
            )}
          >
            {a === "him" ? t.beforeAfter.toggleForHim : t.beforeAfter.toggleForHer}
          </button>
        ))}
      </div>
      <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-600">
        {t.beforeAfter.toggleHint}
      </span>
    </div>
  );
}

function RatingStars({ compact }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label="4.9 out of 5 stars">
      {!compact && <span className="mr-1 font-display text-sm font-bold text-white">4.9</span>}
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("fill-white text-white", compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5")}
        />
      ))}
    </span>
  );
}

function ProfileMakeoverBadge({ t }: { t: Dictionary }) {
  return (
    <div className="shrink-0 pb-0.5 text-center font-display text-[10px] font-bold uppercase leading-[1.35] tracking-[0.1em] text-rose-500 sm:text-[11px]">
      <span className="block">{t.profileBadge.line1}</span>
      <span className="block">{t.profileBadge.line2}</span>
    </div>
  );
}

function ProofTitle({ title }: { title: string }) {
  const match = title.match(/^(.*\b)(stop)$/i);
  if (!match) return <>{title}</>;

  return (
    <>
      {match[1]}
      <span className={cn("uppercase", ACCENT)}>{match[2]}</span>
    </>
  );
}

function Kicker({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400",
        center && "justify-center"
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", ACCENT_BG)} />
      {children}
    </p>
  );
}

function SectionHeading({
  kicker,
  title,
  body,
  center,
}: {
  kicker: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <Kicker center={center}>{kicker}</Kicker>
      <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
        {title}
      </h2>
      {body && <p className="mt-6 text-lg font-light leading-relaxed text-zinc-400">{body}</p>}
    </div>
  );
}

/* -------------------- Photo + its own swipe-appeal meter ------------------ */

function PhotoWithMeter({
  t,
  src,
  tone,
  score,
  beforeCaption,
  afterCaption,
}: {
  t: Dictionary;
  src: string;
  tone: "before" | "after";
  score: number;
  beforeCaption?: string;
  afterCaption?: string;
}) {
  const isAfter = tone === "after";
  const label = isAfter ? t.beforeAfter.afterLabel : t.beforeAfter.beforeLabel;
  const caption = isAfter
    ? (afterCaption ?? t.beforeAfter.meterAfterCaption)
    : (beforeCaption ?? t.beforeAfter.meterBeforeCaption);

  return (
    <figure>
      <div className="mb-3 flex items-center justify-between px-0.5">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            isAfter ? "text-white" : "text-zinc-400"
          )}
        >
          {label}
        </span>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/15">
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, 300px"
          className="object-cover"
        />
      </div>

      <figcaption className="mt-3 px-0.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.beforeAfter.meterLabel}
          </span>
          <span className="font-display text-base font-bold tabular-nums text-white">
            {score.toFixed(1)}
            <span className="ml-0.5 text-[10px] font-normal text-zinc-500">/10</span>
          </span>
        </div>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            className={cn("h-full animate-meter-fill rounded-full", ACCENT_BG)}
            style={{ width: `${score * 10}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">{caption}</p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero({
  t,
  audience,
  onAudienceChange,
  onCheckout,
  checkingOut,
  checkoutBlocked,
}: {
  t: Dictionary;
  audience: Audience;
  onAudienceChange: (a: Audience) => void;
  onCheckout: () => void;
  checkingOut?: boolean;
  checkoutBlocked?: boolean;
}) {
  return (
    <section id="hero" className="relative overflow-hidden px-6 pb-20 pt-24 sm:pt-32">
      <div className="pointer-events-none absolute -top-64 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
          <span className={cn("h-1.5 w-1.5 rounded-full", ACCENT_BG)} />
          {t.hero.badge}
        </div>

        <h1 className="font-display text-[2.6rem] font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
          {t.hero.titleLine1}{" "}
          <em className={cn("font-serif font-normal normal-case italic", ACCENT)}>
            {audience === "him" ? t.hero.titleAccent : t.hero.titleAccentAlt}
          </em>
          <br />
          {t.hero.titleLine2}
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-zinc-400">
          {t.hero.subtitle}
        </p>

        <AudienceToggle
          t={t}
          audience={audience}
          onAudienceChange={onAudienceChange}
          className="mt-10"
        />

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CheckoutButton
            label={t.hero.cta}
            onCheckout={onCheckout}
            checkingOut={checkingOut}
            disabled={checkoutBlocked}
            className={cn(CTA_PRIMARY, "w-full px-10 py-4 text-sm sm:w-auto")}
          >
            <ArrowRight className="h-4 w-4" />
          </CheckoutButton>
          <a href="#results" className={cn(CTA_GHOST, "w-full px-8 py-4 text-sm sm:w-auto")}>
            {t.hero.ctaSecondary}
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.1em] text-zinc-500">
          <RatingStars />
          <span>{t.hero.ratingLabel}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Trust marquee ---------------------------- */

function TrustMarquee({ t }: { t: Dictionary }) {
  const items = [...DATING_APPS, ...DATING_APPS];

  return (
    <section className="border-y border-white/10 py-10">
      <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
        {t.trustBar.label}
      </p>
      <div className="relative overflow-hidden" aria-hidden="true">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#050505] to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 font-display text-2xl font-bold uppercase tracking-tight text-zinc-700 transition hover:text-zinc-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Proof section ---------------------------- */

function ProofSection({ t, audience }: { t: Dictionary; audience: Audience }) {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Kicker center>{t.proof.kicker}</Kicker>
          <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            <ProofTitle title={audience === "him" ? t.proof.title : t.proof.titleAlt} />
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-zinc-400">{t.proof.body}</p>
        </div>
        <div className="mt-16 grid divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {t.proof.stats.map((stat) => (
            <div key={stat.label} className="px-8 py-10 text-center">
              <div className={cn("font-display text-6xl font-bold tracking-tight sm:text-7xl", ACCENT)}>
                {stat.value}
              </div>
              <p className="mx-auto mt-4 max-w-[16rem] text-sm leading-relaxed text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Before / After ---------------------------- */

function BeforeAfterSection({
  t,
  audience,
  onAudienceChange,
}: {
  t: Dictionary;
  audience: Audience;
  onAudienceChange: (a: Audience) => void;
}) {
  const examples = BEFORE_AFTER_EXAMPLES[audience];
  const captions = t.beforeAfter.examples[audience];

  return (
    <section id="results" className="scroll-mt-28 border-t border-white/10 px-6 pb-16 pt-20 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker={t.beforeAfter.kicker}
          title={t.beforeAfter.title}
          body={t.beforeAfter.body}
          center
        />

        <div className="mt-12 flex justify-center">
          <AudienceToggle t={t} audience={audience} onAudienceChange={onAudienceChange} />
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2" key={audience}>
          {examples.map((example, index) => (
            <div key={example.id} className="grid grid-cols-2 gap-4 sm:gap-5">
              <PhotoWithMeter
                t={t}
                src={example.before}
                tone="before"
                score={example.beforeScore}
                beforeCaption={captions[index]?.beforeCaption}
                afterCaption={captions[index]?.afterCaption}
              />
              <PhotoWithMeter
                t={t}
                src={example.after}
                tone="after"
                score={example.afterScore}
                beforeCaption={captions[index]?.beforeCaption}
                afterCaption={captions[index]?.afterCaption}
              />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.15em] text-zinc-700">
          {t.beforeAfter.disclaimer}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Gaze section ----------------------------- */

function GazeSection({ t }: { t: Dictionary }) {
  const [gazeAudience, setGazeAudience] = useState<Audience>("him");
  const icons = [MessageCircleHeart, BadgeCheck, ScanFace];
  const photos = GAZE_EXAMPLES[gazeAudience];

  return (
    <section className="border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker={t.gaze.kicker}
          title={gazeAudience === "him" ? t.gaze.titleHim : t.gaze.titleHer}
          body={t.gaze.body}
        />

        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-full border border-white/15 p-1">
            {(["him", "her"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setGazeAudience(a)}
                className={cn(
                  "rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition",
                  gazeAudience === a
                    ? cn(ACCENT_BG, "text-white")
                    : "text-zinc-500 hover:text-white"
                )}
              >
                {a === "him" ? t.gaze.toggleForHim : t.gaze.toggleForHer}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4" key={gazeAudience}>
          {photos.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
            >
              <Image
                src={src}
                alt={`${gazeAudience === "him" ? t.gaze.toggleForHim : t.gaze.toggleForHer} example ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 400px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {t.gaze.points.map((point, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={point.title} className="bg-[#050505] p-10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-tight">
                  {point.title}
                </h3>
                <p className="mt-3 font-light leading-relaxed text-zinc-400">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Photoshoot comparison ------------------------ */

function PhotoshootComparison({
  t,
  priceValues,
}: {
  t: Dictionary;
  priceValues: Record<string, string | number>;
}) {
  return (
    <section className="border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          kicker={t.photoshoot.kicker}
          title={format(t.photoshoot.title, priceValues)}
          body={t.photoshoot.body}
          center
        />

        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-2 border-b border-white/10 text-center">
            <div className="border-r border-white/10 bg-white/[0.02] px-4 py-6 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
              {t.photoshoot.themLabel}
            </div>
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-6 text-[11px] font-bold uppercase tracking-[0.25em]",
                ACCENT_BG,
                "text-white"
              )}
            >
              {format(t.photoshoot.usLabel, priceValues)}
            </div>
          </div>
          {t.photoshoot.rows.map((row) => (
            <div key={row.them} className="grid grid-cols-2 border-b border-white/10 last:border-b-0">
              <div className="flex items-start gap-3 border-r border-white/10 bg-white/[0.02] px-5 py-5 text-sm font-light text-zinc-600 sm:px-8">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-700" strokeWidth={1.5} />
                {format(row.them, priceValues)}
              </div>
              <div className="flex items-start gap-3 border-l border-rose-500/20 bg-rose-500/[0.06] px-5 py-5 text-sm text-zinc-100 sm:px-8">
                <Check className={cn("mt-0.5 h-4 w-4 shrink-0", ACCENT)} strokeWidth={2} />
                {format(row.us, priceValues)}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center font-serif text-2xl italic leading-snug text-zinc-300 sm:text-3xl">
          {t.photoshoot.punchline}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Match section ---------------------------- */

function MatchSection({ t, locale }: { t: Dictionary; locale: string }) {
  const matchImage = getLocalizedMatchImage(locale);
  const [imgSrc, setImgSrc] = useState(matchImage.src);

  useEffect(() => {
    setImgSrc(getLocalizedMatchImage(locale).src);
  }, [locale]);

  return (
    <section className="border-t border-white/10 px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading kicker={t.match.kicker} title={t.match.title} body={t.match.body} />
        </div>
        <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <Image
            key={imgSrc}
            src={imgSrc}
            alt={t.match.imageAlt}
            width={matchImage.width}
            height={matchImage.height}
            onError={() => setImgSrc(MATCH_IMAGE.src)}
            sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 448px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Manifesto ------------------------------ */

function Manifesto({ t }: { t: Dictionary }) {
  return (
    <section className="border-t border-white/10 px-6 py-32">
      <figure className="mx-auto max-w-4xl text-center">
        <span className={cn("mx-auto block h-1.5 w-1.5 rounded-full", ACCENT_BG)} />
        <blockquote className="mt-10 font-serif text-3xl italic leading-[1.25] text-zinc-100 sm:text-[2.75rem]">
          &ldquo;{t.manifesto.text}&rdquo;
        </blockquote>
        <figcaption className="mt-10 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
          {format(t.manifesto.attribution, { appName: APP_NAME })}
        </figcaption>
      </figure>
    </section>
  );
}

/* --------------------------------- Steps --------------------------------- */

function StepsSection({ t, photoCount }: { t: Dictionary; photoCount: number }) {
  return (
    <section className="border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.steps.kicker} title={t.steps.title} center />
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {t.steps.items.map((step, i) => (
            <div key={step.title} className="bg-[#050505] p-10">
              <span className="font-display text-5xl font-bold text-zinc-800">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-tight">
                {format(step.title, { photoCount })}
              </h3>
              <p className="mt-3 font-light leading-relaxed text-zinc-400">
                {format(step.body, { photoCount })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Pricing -------------------------------- */

function PricingSection({
  t,
  onCheckout,
  checkingOut,
  checkoutBlocked,
  photoCount,
  editCount,
  priceLabel,
}: {
  t: Dictionary;
  onCheckout: () => void;
  checkingOut?: boolean;
  checkoutBlocked?: boolean;
  photoCount: number;
  editCount: number;
  priceLabel: string;
}) {
  const values = { photoCount, editCount };

  return (
    <section id="pricing" className="scroll-mt-28 border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.pricing.kicker} title={t.pricing.title} body={t.pricing.body} center />

        <div className="mx-auto mt-16 max-w-lg overflow-hidden rounded-3xl border border-white/15 border-t-[3px] border-t-rose-500">
          <div className="p-8 sm:p-12">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.25em]">
                {t.pricing.planName}
              </h3>
              <ProfileMakeoverBadge t={t} />
            </div>

            <div className="mt-8">
              <span className="block font-display text-7xl font-bold tracking-tight sm:text-8xl">
                {priceLabel}
              </span>
            </div>

            <ul className="mt-10 space-y-4 border-t border-white/10 pt-8">
              {t.pricing.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3.5 text-sm text-zinc-300">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", ACCENT)} strokeWidth={2} />
                  {format(feature, values)}
                </li>
              ))}
            </ul>

            <CheckoutButton
              label={t.pricing.cta}
              onCheckout={onCheckout}
              checkingOut={checkingOut}
              disabled={checkoutBlocked}
              className={cn(CTA_PRIMARY, "mt-10 w-full py-4.5 text-sm sm:py-5")}
            >
              <ArrowRight className="h-4 w-4" />
            </CheckoutButton>

            <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-zinc-600">
              <Lock className="h-3 w-3" strokeWidth={1.5} />
              {t.pricing.guarantee}
            </p>
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-md text-center font-serif text-xl italic text-zinc-400">
          {t.pricing.payoff}
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */

function FAQSection({
  t,
  priceValues,
}: {
  t: Dictionary;
  priceValues: Record<string, string | number>;
}) {
  return (
    <section id="faq" className="scroll-mt-28 border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          {t.faq.title}
        </h2>
        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-bold tracking-tight [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-zinc-600 transition-transform group-open:rotate-180"
                  strokeWidth={1.5}
                />
              </summary>
              <p className="mt-4 max-w-2xl font-light leading-relaxed text-zinc-400">
                {format(item.a, priceValues)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Final CTA ------------------------------ */

function FinalCta({
  t,
  onCheckout,
  checkingOut,
  checkoutBlocked,
}: {
  t: Dictionary;
  onCheckout: () => void;
  checkingOut?: boolean;
  checkoutBlocked?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-6 py-36">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[24rem] w-[50rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
          {t.finalCta.title}
        </h2>
        <p className="mx-auto mt-8 max-w-xl font-serif text-xl italic text-zinc-400 sm:text-2xl">
          {t.finalCta.body}
        </p>
        <CheckoutButton
          label={t.finalCta.cta}
          onCheckout={onCheckout}
          checkingOut={checkingOut}
          disabled={checkoutBlocked}
          className={cn(CTA_PRIMARY, "mt-12 px-12 py-5 text-sm")}
        >
          <ArrowRight className="h-4 w-4" />
        </CheckoutButton>
      </div>
    </section>
  );
}

/* --------------------------------- Footer -------------------------------- */

function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-white/10 px-6 py-14 pb-36 sm:pb-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <span className="font-display text-sm font-bold uppercase tracking-[0.25em]">
          {APP_NAME}
        </span>
        <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">{t.footer.tagline}</p>
        <p className="text-xs text-zinc-600">
          {t.footer.support}{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-zinc-400 underline underline-offset-4 transition hover:text-white"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="text-xs text-zinc-700">
          © {new Date().getFullYear()} {APP_NAME}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
