// ============================================
// Analytics Tracker Component
// Handles automatic page tracking and global events
// ============================================

"use client";

import { useEffect } from "react";
import { usePageTracking, useAnalytics } from "@/lib/analytics";

export default function AnalyticsTracker() {
  // Auto track page views
  usePageTracking();

  const { trackExternalLink, trackSocialClick, initialized } = useAnalytics();

  // Track external link clicks globally
  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Check if external link
      try {
        const url = new URL(href, window.location.origin);

        // External link
        if (url.hostname !== window.location.hostname) {
          const text = link.textContent?.trim() || "";

          // Check if social link
          const socialPlatforms: Record<string, string> = {
            "linkedin.com": "LinkedIn",
            "github.com": "GitHub",
            "twitter.com": "Twitter",
            "x.com": "Twitter",
            "facebook.com": "Facebook",
            "instagram.com": "Instagram",
            "youtube.com": "YouTube",
          };

          const platform = Object.entries(socialPlatforms).find(([domain]) =>
            url.hostname.includes(domain)
          );

          if (platform) {
            trackSocialClick(platform[1], href);
          } else {
            trackExternalLink(href, text);
          }
        }
      } catch {
        // Invalid URL, ignore
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [initialized, trackExternalLink, trackSocialClick]);

  // Track visibility changes
  useEffect(() => {
    if (!initialized || typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      // Could track visibility changes here if needed
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [initialized]);

  // This component doesn't render anything
  return null;
}
