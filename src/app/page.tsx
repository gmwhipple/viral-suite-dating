"use client";

import { useABTest } from "@/hooks/useABTest";
import { LandingVariantA, LandingVariantB } from "@/components/landing/LandingVariants";

export default function HomePage() {
  const { variant, trackEvent } = useABTest();

  const handleCtaClick = () => {
    trackEvent("cta_click");
  };

  return variant === "B" ? (
    <LandingVariantB onCtaClick={handleCtaClick} />
  ) : (
    <LandingVariantA onCtaClick={handleCtaClick} />
  );
}
