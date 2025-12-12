// ============================================
// Analytics System - Main Entry Point
// ============================================

// Types
export * from "./types";

// Configuration
export { analyticsConfig, COLLECTIONS, STORAGE_KEYS } from "./config";

// Core modules
export {
  getFingerprint,
  getExtendedFingerprint,
  clearFingerprintCache,
} from "./core/fingerprint";

export {
  getGeolocation,
  parseCloudflareHeaders,
  hasCloudflareGeo,
  clearGeoCache,
  getCountryName,
} from "./core/geolocation";

export {
  getDeviceInfo,
  isBot,
  updateViewportDimensions,
  clearDeviceCache,
  getDeviceEmoji,
} from "./core/device";

export {
  getVisitorId,
  getSessionId,
  createSession,
  getSession,
  updateSessionActivity,
  incrementPageviews,
  incrementEvents,
  endSession,
  isNewVisitor,
  formatDuration,
  parseUTMParams,
  parseReferrer,
} from "./core/session";

// Tracking modules
export {
  trackPageview,
  endPageview,
  getCurrentPageview,
  getCurrentPageviewId,
  getTimeOnPage,
  updateScrollDepth,
  updatePerformanceMetric,
  formatTimeOnPage,
} from "./tracking/pageview";

export {
  trackEvent,
  trackFormSubmit,
  trackContactForm,
  trackNewsletter,
  trackCVDownload,
  trackArticleView,
  trackArticleCompleted,
  trackArticleShare,
  trackCodeCopy,
  trackSocialClick,
  trackExternalLink,
  trackInternalLink,
  trackConferenceView,
  trackConferenceClick,
  trackProjectView,
  trackProjectClick,
  trackServiceView,
  trackServiceClick,
  trackScrollDepth,
  trackTimeOnPage,
  trackPageVisibility,
  trackError,
  flushEventQueue,
  getEventQueue,
  onEvent,
  clearEventCallbacks,
} from "./tracking/events";

export {
  startScrollTracking,
  stopScrollTracking,
  resetScrollTracking,
  getCurrentScrollDepth,
  getMaxScrollDepth,
  getTrackedThresholds,
  isScrollTrackingActive,
  checkScrollDepth,
} from "./tracking/scroll";

// Storage
export {
  saveSession,
  updateSession,
  getSession as getSessionFromDb,
  saveVisitor,
  getVisitor,
  savePageview,
  updatePageview,
  saveEvent,
  saveEventsBatch,
  getRecentSessions,
  getRecentEvents,
  getPageviewsByPath,
  getDailyStats,
  getDashboardMetrics,
} from "./storage/firestore";

// Hooks
export { useAnalytics } from "./hooks/useAnalytics";
export { usePageTracking, useArticleTracking } from "./hooks/usePageTracking";

// Provider
export { AnalyticsProvider, AnalyticsContext } from "./providers/AnalyticsProvider";
