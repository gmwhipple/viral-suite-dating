"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureRedditClickId, trackViewContent } from "@/lib/reddit-browser";

const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID?.trim();

export function RedditPixel() {
  const pathname = usePathname();

  useEffect(() => {
    captureRedditClickId();
  }, [pathname]);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (pathname === "/") {
      trackViewContent();
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <Script id="reddit-pixel" strategy="afterInteractive">
      {`
        !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${PIXEL_ID}",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
        rdt('init','${PIXEL_ID}');
        rdt('track', 'PageVisit');
      `}
    </Script>
  );
}
