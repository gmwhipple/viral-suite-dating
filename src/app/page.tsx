"use client";

import { useABTest } from "@/hooks/useABTest";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  const { trackEvent } = useABTest();

  const handleCtaClick = () => {
    trackEvent("cta_click");
  };

  return <LandingPage onCtaClick={handleCtaClick} />;
}
