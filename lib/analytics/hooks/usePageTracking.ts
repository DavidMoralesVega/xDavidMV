// ============================================
// Page Tracking Hook
// ============================================

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "./useAnalytics";

/**
 * Hook to automatically track page views
 * Should be used once in the layout/root component
 */
export function usePageTracking() {
  const pathname = usePathname();
  const { trackPageview, initialized } = useAnalytics();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized) return;

    // Avoid tracking the same page twice
    if (lastTrackedPath.current === pathname) return;

    // Track pageview
    trackPageview(pathname);
    lastTrackedPath.current = pathname;
  }, [pathname, initialized, trackPageview]);
}

/**
 * Hook for scroll-based article completion tracking
 */
export function useArticleTracking(slug: string, title: string) {
  const { trackEvent, initialized } = useAnalytics();
  const startTime = useRef<number>(Date.now());
  const hasTrackedCompletion = useRef<boolean>(false);

  useEffect(() => {
    if (!initialized) return;

    // Track article view
    trackEvent("article_view", "content", {
      label: title,
      properties: { slug, title },
    });

    // Reset on slug change
    startTime.current = Date.now();
    hasTrackedCompletion.current = false;
  }, [slug, title, initialized, trackEvent]);

  // Function to call when article is completed (90%+ scroll)
  const markAsCompleted = () => {
    if (hasTrackedCompletion.current || !initialized) return;

    const readTime = Math.round((Date.now() - startTime.current) / 1000);
    trackEvent("article_completed", "engagement", {
      label: title,
      value: readTime,
      properties: { slug, title, readTime },
    });

    hasTrackedCompletion.current = true;
  };

  return { markAsCompleted };
}
