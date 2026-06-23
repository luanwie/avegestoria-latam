"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid duplicate tracking on strict mode re-renders
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, section: null }),
    }).catch(() => {}); // silently fail
  }, [pathname]);

  return null; // renders nothing
}

/**
 * Call this on CTA click to track conversion events.
 * Usage: onClick={() => trackCTA("Hero Probar gratis")}
 */
export function trackCTA(ctaName: string) {
  fetch("/api/analytics/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: window.location.pathname,
      ctaClick: ctaName,
    }),
  }).catch(() => {});
}
