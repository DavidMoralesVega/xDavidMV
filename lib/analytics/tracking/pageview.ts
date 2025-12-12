// ============================================
// Pageview Tracking Service
// ============================================

import type { Pageview, PageviewCreate, PerformanceMetrics } from "../types";
import { analyticsConfig } from "../config";
import { getSession, incrementPageviews, updateSessionActivity } from "../core/session";
import { getDeviceInfo } from "../core/device";

// Current pageview state
let currentPageview: Pageview | null = null;
let pageEntryTime: number = 0;
let maxScrollDepth: number = 0;

/**
 * Generate unique ID
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `pv-${timestamp}-${random}`;
}

/**
 * Get performance metrics using Performance API
 */
function getPerformanceMetrics(): PerformanceMetrics {
  const defaultMetrics: PerformanceMetrics = {
    ttfb: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    inp: 0,
    pageLoadTime: 0,
    domContentLoaded: 0,
    resourceCount: 0,
    resourceSize: 0,
  };

  if (typeof window === "undefined" || !window.performance) {
    return defaultMetrics;
  }

  try {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

    if (navigation) {
      defaultMetrics.ttfb = navigation.responseStart - navigation.requestStart;
      defaultMetrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime;
      defaultMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime;
    }

    // Get paint timings
    const paintEntries = performance.getEntriesByType("paint");
    const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    if (fcpEntry) {
      defaultMetrics.fcp = fcpEntry.startTime;
    }

    // Get resource metrics
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    defaultMetrics.resourceCount = resources.length;
    defaultMetrics.resourceSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    // LCP, CLS, FID, INP are collected via web-vitals or PerformanceObserver
    // These will be updated asynchronously
  } catch (error) {
    console.warn("[Analytics] Performance metrics error:", error);
  }

  return defaultMetrics;
}

/**
 * Track a pageview
 */
export async function trackPageview(path?: string, title?: string): Promise<Pageview | null> {
  // Check if tracking is enabled
  if (!analyticsConfig.enabled) {
    return null;
  }

  // Check excluded paths
  const currentPath = path || (typeof window !== "undefined" ? window.location.pathname : "");
  const isExcluded = analyticsConfig.excludePaths.some((pattern) => {
    if (pattern.endsWith("*")) {
      return currentPath.startsWith(pattern.slice(0, -1));
    }
    return currentPath === pattern;
  });

  if (isExcluded) {
    return null;
  }

  // End previous pageview if exists
  if (currentPageview) {
    endPageview();
  }

  // Get session
  const session = await getSession();

  // Create pageview
  const now = new Date();
  pageEntryTime = Date.now();
  maxScrollDepth = 0;

  const pageview: Pageview = {
    id: generateId(),
    sessionId: session.id,
    visitorId: session.visitorId,
    path: currentPath,
    title: title || (typeof document !== "undefined" ? document.title : ""),
    referrer: typeof document !== "undefined" ? document.referrer : "",
    timestamp: now,
    timeOnPage: 0,
    scrollDepth: 0,
    device: getDeviceInfo(),
    performance: getPerformanceMetrics(),
  };

  currentPageview = pageview;

  // Increment session pageviews
  incrementPageviews();
  updateSessionActivity();

  return pageview;
}

/**
 * Update scroll depth for current pageview
 */
export function updateScrollDepth(depth: number): void {
  if (!currentPageview) return;

  // Only update if deeper than before
  if (depth > maxScrollDepth) {
    maxScrollDepth = depth;
    currentPageview.scrollDepth = depth;
  }
}

/**
 * End current pageview (call on navigation or unload)
 */
export function endPageview(): Pageview | null {
  if (!currentPageview) return null;

  // Calculate time on page
  currentPageview.timeOnPage = Date.now() - pageEntryTime;
  currentPageview.scrollDepth = maxScrollDepth;

  const pageview = currentPageview;
  currentPageview = null;
  pageEntryTime = 0;
  maxScrollDepth = 0;

  return pageview;
}

/**
 * Get current pageview
 */
export function getCurrentPageview(): Pageview | null {
  return currentPageview;
}

/**
 * Get current pageview ID
 */
export function getCurrentPageviewId(): string | null {
  return currentPageview?.id || null;
}

/**
 * Get time on current page
 */
export function getTimeOnPage(): number {
  if (!pageEntryTime) return 0;
  return Date.now() - pageEntryTime;
}

/**
 * Update performance metrics (called from web-vitals)
 */
export function updatePerformanceMetric(
  name: "lcp" | "cls" | "fid" | "inp",
  value: number
): void {
  if (!currentPageview) return;

  currentPageview.performance[name] = value;
}

/**
 * Get pageview data for saving
 */
export function getPageviewData(): PageviewCreate | null {
  if (!currentPageview) return null;

  const { id, timeOnPage, scrollDepth, ...data } = currentPageview;
  return data as PageviewCreate;
}

/**
 * Format time for display
 */
export function formatTimeOnPage(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
