// ============================================
// Analytics Configuration
// ============================================

import type { AnalyticsConfig } from "./types";

export const analyticsConfig: AnalyticsConfig = {
  // Core settings
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false",
  debug: process.env.NODE_ENV === "development",
  trackBots: false,

  // Session settings
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  heartbeatInterval: 30 * 1000, // 30 seconds

  // Scroll tracking thresholds (percentages)
  scrollThresholds: [25, 50, 75, 90, 100],

  // Paths to exclude from tracking
  excludePaths: [
    "/admin",
    "/admin/*",
    "/api/*",
    "/_next/*",
    "/favicon.ico",
  ],

  // IPs to exclude (internal, testing)
  excludeIPs: [],

  // Sample rate (1 = 100%, 0.5 = 50%)
  sampleRate: 1,

  // Batch processing settings
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  retryAttempts: 3,

  // Feature flags
  features: {
    fingerprinting: true,
    geolocation: true,
    performance: true,
    scrollTracking: true,
    heatmaps: false, // Phase 3
    sessionRecording: false, // Phase 3
  },
};

// Collection names in Firestore
export const COLLECTIONS = {
  VISITORS: "analytics_visitors",
  SESSIONS: "analytics_sessions",
  PAGEVIEWS: "analytics_pageviews",
  EVENTS: "analytics_events",
  DAILY_STATS: "analytics_daily_stats",
  REALTIME: "analytics_realtime",
} as const;

// Storage keys for localStorage/sessionStorage
export const STORAGE_KEYS = {
  VISITOR_ID: "dmv_visitor_id",
  SESSION_ID: "dmv_session_id",
  FINGERPRINT: "dmv_fingerprint",
  CONSENT: "dmv_consent",
  LAST_ACTIVITY: "dmv_last_activity",
} as const;

// Known bot user agents patterns
export const BOT_PATTERNS = [
  "bot",
  "crawl",
  "spider",
  "slurp",
  "mediapartners",
  "lighthouse",
  "pagespeed",
  "gtmetrix",
  "pingdom",
  "uptimerobot",
  "headless",
  "phantom",
  "selenium",
  "puppeteer",
  "playwright",
];

// Social network referrer domains
export const SOCIAL_DOMAINS: Record<string, string> = {
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "fb.me": "Facebook",
  "twitter.com": "Twitter",
  "t.co": "Twitter",
  "x.com": "Twitter",
  "linkedin.com": "LinkedIn",
  "lnkd.in": "LinkedIn",
  "instagram.com": "Instagram",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "tiktok.com": "TikTok",
  "pinterest.com": "Pinterest",
  "reddit.com": "Reddit",
  "github.com": "GitHub",
};

// Search engine referrer domains
export const SEARCH_ENGINES: Record<string, string> = {
  "google.com": "Google",
  "google.co": "Google",
  "bing.com": "Bing",
  "yahoo.com": "Yahoo",
  "duckduckgo.com": "DuckDuckGo",
  "baidu.com": "Baidu",
  "yandex.com": "Yandex",
  "ecosia.org": "Ecosia",
};

// Event categories configuration
export const EVENT_CONFIG = {
  engagement: {
    label: "Engagement",
    color: "#3B82F6",
  },
  conversion: {
    label: "Conversión",
    color: "#10B981",
  },
  navigation: {
    label: "Navegación",
    color: "#6366F1",
  },
  social: {
    label: "Social",
    color: "#EC4899",
  },
  content: {
    label: "Contenido",
    color: "#F59E0B",
  },
  error: {
    label: "Errores",
    color: "#EF4444",
  },
  performance: {
    label: "Performance",
    color: "#8B5CF6",
  },
} as const;
