"use client";

import { useABTest } from "@/hooks/useABTest";
import { LandingVariantA, LandingVariantB } from "@/components/landing/LandingVariants";

export default function HomePage() {
  const { variant, ready, trackEvent } = useABTest();

  const handleCtaClick = () => {
    trackEvent("cta_click");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
      </div>
    );
  }

  return variant === "B" ? (
    <LandingVariantB onCtaClick={handleCtaClick} />
  ) : (
    <LandingVariantA onCtaClick={handleCtaClick} />
  );
}
