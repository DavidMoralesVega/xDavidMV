// ============================================
// Scroll Depth Tracking Service
// ============================================

import { analyticsConfig } from "../config";
import { updateScrollDepth } from "./pageview";
import { trackScrollDepth } from "./events";

// Tracking state
let isTracking = false;
let trackedThresholds: Set<number> = new Set();
let scrollHandler: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;
let lastScrollDepth = 0;

// Document dimensions (cached for performance)
let documentHeight = 0;
let viewportHeight = 0;

/**
 * Calculate current scroll depth percentage
 */
function calculateScrollDepth(): number {
  if (typeof window === "undefined") return 0;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollableHeight = documentHeight - viewportHeight;

  if (scrollableHeight <= 0) {
    return 100; // Page fits in viewport
  }

  const depth = Math.round((scrollTop / scrollableHeight) * 100);
  return Math.min(Math.max(depth, 0), 100);
}

/**
 * Update cached document dimensions
 */
function updateDimensions(): void {
  if (typeof window === "undefined") return;

  viewportHeight = window.innerHeight;
  documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
}

/**
 * Handle scroll event
 */
function handleScroll(): void {
  const depth = calculateScrollDepth();

  // Update pageview scroll depth
  if (depth > lastScrollDepth) {
    lastScrollDepth = depth;
    updateScrollDepth(depth);
  }

  // Check thresholds
  for (const threshold of analyticsConfig.scrollThresholds) {
    if (depth >= threshold && !trackedThresholds.has(threshold)) {
      trackedThresholds.add(threshold);

      // Track scroll event
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      trackScrollDepth(threshold, path);

      if (analyticsConfig.debug) {
        console.log(`[Analytics] Scroll depth: ${threshold}%`);
      }
    }
  }
}

/**
 * Handle resize event (recalculate dimensions)
 */
function handleResize(): void {
  updateDimensions();
}

/**
 * Debounce function for scroll performance
 */
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function for scroll performance
 */
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Start scroll tracking
 */
export function startScrollTracking(): void {
  if (isTracking || typeof window === "undefined") return;

  if (!analyticsConfig.features.scrollTracking) {
    return;
  }

  // Reset state
  trackedThresholds.clear();
  lastScrollDepth = 0;

  // Update dimensions
  updateDimensions();

  // Create handlers with throttle/debounce
  scrollHandler = throttle(handleScroll, 100);
  resizeHandler = debounce(handleResize, 250);

  // Add event listeners
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("resize", resizeHandler, { passive: true });

  isTracking = true;

  // Initial check
  handleScroll();

  if (analyticsConfig.debug) {
    console.log("[Analytics] Scroll tracking started");
  }
}

/**
 * Stop scroll tracking
 */
export function stopScrollTracking(): void {
  if (!isTracking || typeof window === "undefined") return;

  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }

  isTracking = false;

  if (analyticsConfig.debug) {
    console.log("[Analytics] Scroll tracking stopped");
  }
}

/**
 * Reset scroll tracking (for page navigation)
 */
export function resetScrollTracking(): void {
  trackedThresholds.clear();
  lastScrollDepth = 0;
  updateDimensions();

  if (analyticsConfig.debug) {
    console.log("[Analytics] Scroll tracking reset");
  }
}

/**
 * Get current scroll depth
 */
export function getCurrentScrollDepth(): number {
  return calculateScrollDepth();
}

/**
 * Get max scroll depth reached
 */
export function getMaxScrollDepth(): number {
  return lastScrollDepth;
}

/**
 * Get tracked thresholds
 */
export function getTrackedThresholds(): number[] {
  return [...trackedThresholds];
}

/**
 * Check if scroll tracking is active
 */
export function isScrollTrackingActive(): boolean {
  return isTracking;
}

/**
 * Manually trigger scroll depth check
 * (useful for dynamic content loading)
 */
export function checkScrollDepth(): void {
  updateDimensions();
  handleScroll();
}
