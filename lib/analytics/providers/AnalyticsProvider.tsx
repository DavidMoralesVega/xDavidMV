// ============================================
// Analytics Provider - React Context
// ============================================

"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { analyticsConfig } from "../config";
import type {
  Session,
  Pageview,
  AnalyticsEvent,
  EventCategory,
  EventName,
  AnalyticsState,
} from "../types";

// Core modules
import { getFingerprint } from "../core/fingerprint";
import { getDeviceInfo, isBot } from "../core/device";
import { getGeolocation } from "../core/geolocation";
import {
  createSession,
  getSession,
  getVisitorId,
  getSessionId,
  endSession,
  updateSessionActivity,
} from "../core/session";

// Tracking modules
import {
  trackPageview as trackPageviewCore,
  endPageview,
  getCurrentPageview,
  updateScrollDepth,
} from "../tracking/pageview";
import {
  trackEvent as trackEventCore,
  flushEventQueue,
  onEvent,
} from "../tracking/events";
import {
  startScrollTracking,
  stopScrollTracking,
  resetScrollTracking,
} from "../tracking/scroll";

// Storage
import {
  saveSession,
  updateSession,
  saveVisitor,
  savePageview,
  updatePageview,
  saveEvent,
  saveEventsBatch,
} from "../storage/firestore";

// Firebase Analytics (Google Analytics)
import { trackEvent as trackFirebaseEvent } from "@/lib/firebase";

// ---------- Context Types ----------

interface AnalyticsContextValue {
  initialized: boolean;
  sessionId: string | null;
  visitorId: string | null;
  fingerprint: string | null;

  // Tracking methods
  trackPageview: (path?: string, title?: string) => Promise<void>;
  trackEvent: (
    name: EventName | string,
    category?: EventCategory,
    options?: {
      label?: string;
      value?: number;
      properties?: Record<string, unknown>;
    }
  ) => Promise<void>;

  // Convenience methods
  trackContactForm: (success: boolean, data?: Record<string, unknown>) => Promise<void>;
  trackNewsletter: (success: boolean) => Promise<void>;
  trackCVDownload: (format?: string) => Promise<void>;
  trackSocialClick: (platform: string, url: string) => Promise<void>;
  trackExternalLink: (url: string, text?: string) => Promise<void>;
  trackCodeCopy: (language?: string) => Promise<void>;

  // State
  session: Session | null;
  currentPageview: Pageview | null;
}

// ---------- Context Creation ----------

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// ---------- Provider Props ----------

interface AnalyticsProviderProps {
  children: ReactNode;
}

// ---------- Helper Functions ----------

/**
 * Check if a path should be excluded from tracking
 */
function isPathExcluded(pathname: string): boolean {
  return analyticsConfig.excludePaths.some((excludePath) => {
    // Check if exact match
    if (excludePath === pathname) return true;

    // Check if wildcard match (e.g., "/admin/*")
    if (excludePath.endsWith("/*")) {
      const basePath = excludePath.slice(0, -2);
      return pathname.startsWith(basePath);
    }

    return false;
  });
}

// ---------- Provider Component ----------

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);
  const [state, setState] = useState<AnalyticsState>({
    initialized: false,
    sessionId: null,
    visitorId: null,
    fingerprint: null,
    currentPageviewId: null,
    device: null,
    geo: null,
    consent: { analytics: true, marketing: false, personalization: false },
    queue: [],
  });
  const [session, setSession] = useState<Session | null>(null);
  const [currentPageview, setCurrentPageview] = useState<Pageview | null>(null);

  // Refs for cleanup
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unsubscribeEventRef = useRef<(() => void) | null>(null);

  // ---------- Initialize Analytics ----------

  useEffect(() => {
    if (!analyticsConfig.enabled || typeof window === "undefined") {
      return;
    }

    // Check if current path is excluded
    if (isPathExcluded(pathname)) {
      if (analyticsConfig.debug) {
        console.log(`[Analytics] Path excluded from tracking: ${pathname}`);
      }
      return;
    }

    // Check if bot
    if (!analyticsConfig.trackBots && isBot()) {
      console.log("[Analytics] Bot detected, tracking disabled");
      return;
    }

    const init = async () => {
      try {
        // Get fingerprint
        const fingerprint = await getFingerprint();

        // Get device info
        const device = getDeviceInfo();

        // Get visitor and session IDs
        const visitorId = getVisitorId();
        const sessionId = getSessionId();

        // Create/get session
        const currentSession = await createSession();
        setSession(currentSession);

        // Get geolocation (async, don't block)
        getGeolocation().then((geo) => {
          setState((prev) => ({ ...prev, geo }));
        });

        // Update state
        setState({
          initialized: true,
          sessionId,
          visitorId,
          fingerprint,
          currentPageviewId: null,
          device,
          geo: null,
          consent: { analytics: true, marketing: false, personalization: false },
          queue: [],
        });

        // Save session to Firestore
        await saveSession(currentSession);

        // Save/update visitor
        await saveVisitor({
          id: visitorId,
          fingerprint,
          firstSeenAt: new Date(),
          lastSeenAt: new Date(),
          totalSessions: 1,
          totalPageviews: 0,
          totalEvents: 0,
          devices: [device],
          locations: [],
          tags: [],
        });

        // Start scroll tracking
        startScrollTracking();

        // Subscribe to events for saving
        unsubscribeEventRef.current = onEvent(async (event) => {
          await saveEvent(event);
        });

        // Set up flush interval
        flushIntervalRef.current = setInterval(async () => {
          const events = flushEventQueue();
          if (events.length > 0) {
            await saveEventsBatch(events);
          }
        }, analyticsConfig.flushInterval);

        setInitialized(true);

        if (analyticsConfig.debug) {
          console.log("[Analytics] Initialized", {
            sessionId,
            visitorId,
            fingerprint: fingerprint.substring(0, 8) + "...",
          });
        }
      } catch (error) {
        console.error("[Analytics] Initialization failed:", error);
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      // Stop scroll tracking
      stopScrollTracking();

      // Clear flush interval
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
      }

      // Unsubscribe from events
      if (unsubscribeEventRef.current) {
        unsubscribeEventRef.current();
      }

      // End session and save final pageview
      const finalPageview = endPageview();
      if (finalPageview) {
        updatePageview(finalPageview.id, {
          timeOnPage: finalPageview.timeOnPage,
          scrollDepth: finalPageview.scrollDepth,
        });
      }

      const finalSession = endSession();
      if (finalSession) {
        updateSession(finalSession.id, {
          duration: finalSession.duration,
          pageviews: finalSession.pageviews,
          events: finalSession.events,
          isBounce: finalSession.isBounce,
        });
      }
    };
  }, [pathname]);

  // ---------- Handle page unload ----------

  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    const handleBeforeUnload = async () => {
      // Flush remaining events directly to Firestore
      const events = flushEventQueue();
      if (events.length > 0) {
        // Save events directly (best effort on unload)
        saveEventsBatch(events).catch(() => {});
      }

      // End pageview
      const finalPageview = endPageview();
      if (finalPageview) {
        updatePageview(finalPageview.id, {
          timeOnPage: finalPageview.timeOnPage,
          scrollDepth: finalPageview.scrollDepth,
        }).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [initialized]);

  // ---------- Tracking Methods ----------

  const trackPageview = useCallback(
    async (path?: string, title?: string) => {
      if (!initialized) return;

      // End previous pageview
      const prevPageview = getCurrentPageview();
      if (prevPageview) {
        try {
          await updatePageview(prevPageview.id, {
            timeOnPage: prevPageview.timeOnPage,
            scrollDepth: prevPageview.scrollDepth,
          });
        } catch (error) {
          console.error("[Analytics] Error updating previous pageview:", error);
        }
      }

      // Reset scroll tracking for new page
      resetScrollTracking();

      // Track new pageview
      const pageview = await trackPageviewCore(path, title);
      if (pageview) {
        setCurrentPageview(pageview);

        // Save to Firestore (custom analytics)
        try {
          await savePageview(pageview);
        } catch (error) {
          console.error("[Analytics] Error saving pageview to Firestore:", error);
        }

        setState((prev) => ({
          ...prev,
          currentPageviewId: pageview.id,
        }));

        // Also send to Firebase Analytics (Google Analytics) - independent try-catch
        try {
          trackFirebaseEvent("page_view", {
            page_path: pageview.path,
            page_title: pageview.title,
          });
        } catch (error) {
          console.error("[Analytics] Error sending pageview to Firebase Analytics:", error);
        }
      }
    },
    [initialized]
  );

  const trackEvent = useCallback(
    async (
      name: EventName | string,
      category: EventCategory = "engagement",
      options?: {
        label?: string;
        value?: number;
        properties?: Record<string, unknown>;
      }
    ) => {
      if (!initialized) return;

      // Track in custom system (Firestore) - independent try-catch
      try {
        await trackEventCore(name, category, options);
        updateSessionActivity();
      } catch (error) {
        console.error("[Analytics] Error tracking event to Firestore:", error);
      }

      // Also send to Firebase Analytics (Google Analytics) - independent try-catch
      try {
        trackFirebaseEvent(name, {
          event_category: category,
          event_label: options?.label,
          value: options?.value,
          ...options?.properties,
        });
      } catch (error) {
        console.error("[Analytics] Error sending event to Firebase Analytics:", error);
      }
    },
    [initialized]
  );

  // ---------- Convenience Methods ----------

  const trackContactForm = useCallback(
    async (success: boolean, data?: Record<string, unknown>) => {
      await trackEvent(
        success ? "contact_form_success" : "contact_form_error",
        "conversion",
        { label: "Contact Form", value: success ? 1 : 0, properties: data }
      );
    },
    [trackEvent]
  );

  const trackNewsletter = useCallback(
    async (success: boolean) => {
      await trackEvent(
        success ? "newsletter_success" : "newsletter_error",
        "conversion",
        { label: "Newsletter", value: success ? 1 : 0 }
      );
    },
    [trackEvent]
  );

  const trackCVDownload = useCallback(
    async (format?: string) => {
      await trackEvent("cv_download", "conversion", {
        label: format || "PDF",
        value: 1,
        properties: { format },
      });
    },
    [trackEvent]
  );

  const trackSocialClick = useCallback(
    async (platform: string, url: string) => {
      await trackEvent("social_click", "social", {
        label: platform,
        properties: { platform, url },
      });
    },
    [trackEvent]
  );

  const trackExternalLink = useCallback(
    async (url: string, text?: string) => {
      let domain = "";
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = url;
      }

      await trackEvent("external_link", "navigation", {
        label: domain,
        properties: { url, text, domain },
      });
    },
    [trackEvent]
  );

  const trackCodeCopy = useCallback(
    async (language?: string) => {
      await trackEvent("code_copied", "engagement", {
        label: language || "unknown",
        properties: { language },
      });
    },
    [trackEvent]
  );

  // ---------- Context Value ----------

  const value: AnalyticsContextValue = {
    initialized,
    sessionId: state.sessionId,
    visitorId: state.visitorId,
    fingerprint: state.fingerprint,
    trackPageview,
    trackEvent,
    trackContactForm,
    trackNewsletter,
    trackCVDownload,
    trackSocialClick,
    trackExternalLink,
    trackCodeCopy,
    session,
    currentPageview,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
