// ============================================
// Event Tracking Service
// ============================================

import type { AnalyticsEvent, EventCreate, EventCategory, EventName } from "../types";
import { analyticsConfig } from "../config";
import { getSession, incrementEvents, updateSessionActivity } from "../core/session";
import { getCurrentPageviewId } from "./pageview";

// Event queue for batching
let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

// Event callbacks
type EventCallback = (event: AnalyticsEvent) => void | Promise<void>;
const eventCallbacks: EventCallback[] = [];

/**
 * Generate unique ID
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `e-${timestamp}-${random}`;
}

/**
 * Track a custom event
 */
export async function trackEvent(
  name: EventName | string,
  category: EventCategory = "engagement",
  options: {
    label?: string;
    value?: number;
    properties?: Record<string, unknown>;
    pageviewId?: string;
  } = {}
): Promise<AnalyticsEvent | null> {
  // Check if tracking is enabled
  if (!analyticsConfig.enabled) {
    return null;
  }

  // Get session
  const session = await getSession();

  // Create event
  const event: AnalyticsEvent = {
    id: generateId(),
    sessionId: session.id,
    visitorId: session.visitorId,
    pageviewId: options.pageviewId || getCurrentPageviewId() || undefined,
    category,
    name,
    label: options.label,
    value: options.value,
    properties: options.properties,
    timestamp: new Date(),
    path: typeof window !== "undefined" ? window.location.pathname : "",
  };

  // Increment session events
  incrementEvents();
  updateSessionActivity();

  // Add to queue
  eventQueue.push(event);

  // Trigger callbacks
  for (const callback of eventCallbacks) {
    try {
      await callback(event);
    } catch (error) {
      console.error("[Analytics] Event callback error:", error);
    }
  }

  // Schedule flush
  scheduleFlush();

  // Debug logging
  if (analyticsConfig.debug) {
    console.log("[Analytics] Event tracked:", event);
  }

  return event;
}

// ---------- Convenience Event Methods ----------

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  properties?: Record<string, unknown>
): Promise<AnalyticsEvent | null> {
  const eventName = success ? `${formName}_success` : `${formName}_error`;
  return trackEvent(eventName as EventName, "conversion", {
    label: formName,
    value: success ? 1 : 0,
    properties,
  });
}

/**
 * Track contact form
 */
export function trackContactForm(success: boolean, data?: Record<string, unknown>): Promise<AnalyticsEvent | null> {
  return trackEvent(
    success ? "contact_form_success" : "contact_form_error",
    "conversion",
    {
      label: "Contact Form",
      value: success ? 1 : 0,
      properties: data,
    }
  );
}

/**
 * Track newsletter subscription
 */
export function trackNewsletter(success: boolean, email?: string): Promise<AnalyticsEvent | null> {
  return trackEvent(
    success ? "newsletter_success" : "newsletter_error",
    "conversion",
    {
      label: "Newsletter",
      value: success ? 1 : 0,
      properties: email ? { hasEmail: true } : undefined,
    }
  );
}

/**
 * Track CV download
 */
export function trackCVDownload(format?: string): Promise<AnalyticsEvent | null> {
  return trackEvent("cv_download", "conversion", {
    label: format || "PDF",
    value: 1,
    properties: { format },
  });
}

/**
 * Track article interactions
 */
export function trackArticleView(slug: string, title: string): Promise<AnalyticsEvent | null> {
  return trackEvent("article_view", "content", {
    label: title,
    properties: { slug, title },
  });
}

export function trackArticleCompleted(slug: string, title: string, readTime: number): Promise<AnalyticsEvent | null> {
  return trackEvent("article_completed", "engagement", {
    label: title,
    value: readTime,
    properties: { slug, title, readTime },
  });
}

export function trackArticleShare(slug: string, platform: string): Promise<AnalyticsEvent | null> {
  return trackEvent("article_share", "social", {
    label: platform,
    properties: { slug, platform },
  });
}

/**
 * Track code copy
 */
export function trackCodeCopy(language?: string, snippet?: string): Promise<AnalyticsEvent | null> {
  return trackEvent("code_copied", "engagement", {
    label: language || "unknown",
    properties: {
      language,
      snippetLength: snippet?.length,
    },
  });
}

/**
 * Track social clicks
 */
export function trackSocialClick(platform: string, url: string): Promise<AnalyticsEvent | null> {
  return trackEvent("social_click", "social", {
    label: platform,
    properties: { platform, url },
  });
}

/**
 * Track external links
 */
export function trackExternalLink(url: string, text?: string): Promise<AnalyticsEvent | null> {
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return trackEvent("external_link", "navigation", {
    label: domain,
    properties: { url, text, domain },
  });
}

/**
 * Track internal navigation
 */
export function trackInternalLink(path: string, text?: string): Promise<AnalyticsEvent | null> {
  return trackEvent("internal_link", "navigation", {
    label: path,
    properties: { path, text },
  });
}

/**
 * Track conference interactions
 */
export function trackConferenceView(title: string, properties?: Record<string, unknown>): Promise<AnalyticsEvent | null> {
  return trackEvent("conference_view", "content", {
    label: title,
    properties: { title, ...properties },
  });
}

export function trackConferenceClick(title: string, action: string): Promise<AnalyticsEvent | null> {
  return trackEvent("conference_click", "engagement", {
    label: `${title} - ${action}`,
    properties: { title, action },
  });
}

/**
 * Track project interactions
 */
export function trackProjectView(title: string, properties?: Record<string, unknown>): Promise<AnalyticsEvent | null> {
  return trackEvent("project_view", "content", {
    label: title,
    properties: { title, ...properties },
  });
}

export function trackProjectClick(title: string, action: string, url?: string): Promise<AnalyticsEvent | null> {
  return trackEvent("project_click", "engagement", {
    label: `${title} - ${action}`,
    properties: { title, action, url },
  });
}

/**
 * Track service interactions
 */
export function trackServiceView(service: string): Promise<AnalyticsEvent | null> {
  return trackEvent("service_view", "content", {
    label: service,
    properties: { service },
  });
}

export function trackServiceClick(service: string, action: string): Promise<AnalyticsEvent | null> {
  return trackEvent("service_click", "engagement", {
    label: `${service} - ${action}`,
    properties: { service, action },
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number, path: string): Promise<AnalyticsEvent | null> {
  return trackEvent("scroll_depth", "engagement", {
    label: `${depth}%`,
    value: depth,
    properties: { depth, path },
  });
}

/**
 * Track time on page milestones
 */
export function trackTimeOnPage(seconds: number, path: string): Promise<AnalyticsEvent | null> {
  return trackEvent("time_on_page", "engagement", {
    label: `${seconds}s`,
    value: seconds,
    properties: { seconds, path },
  });
}

/**
 * Track page visibility changes
 */
export function trackPageVisibility(visible: boolean): Promise<AnalyticsEvent | null> {
  return trackEvent("page_visibility", "engagement", {
    label: visible ? "visible" : "hidden",
    value: visible ? 1 : 0,
  });
}

/**
 * Track errors
 */
export function trackError(
  error: string,
  source?: string,
  properties?: Record<string, unknown>
): Promise<AnalyticsEvent | null> {
  return trackEvent("error_occurred", "error", {
    label: error,
    properties: { error, source, ...properties },
  });
}

// ---------- Event Queue Management ----------

/**
 * Schedule queue flush
 */
function scheduleFlush(): void {
  if (flushTimeout) return;

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    // Queue will be flushed by storage layer
  }, analyticsConfig.flushInterval);
}

/**
 * Get and clear event queue
 */
export function flushEventQueue(): AnalyticsEvent[] {
  const events = [...eventQueue];
  eventQueue = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  return events;
}

/**
 * Get event queue without clearing
 */
export function getEventQueue(): AnalyticsEvent[] {
  return [...eventQueue];
}

/**
 * Add event callback
 */
export function onEvent(callback: EventCallback): () => void {
  eventCallbacks.push(callback);

  // Return unsubscribe function
  return () => {
    const index = eventCallbacks.indexOf(callback);
    if (index > -1) {
      eventCallbacks.splice(index, 1);
    }
  };
}

/**
 * Clear all event callbacks
 */
export function clearEventCallbacks(): void {
  eventCallbacks.length = 0;
}
