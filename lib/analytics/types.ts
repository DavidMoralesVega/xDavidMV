// ============================================
// Analytics Types - Scalable Type Definitions
// ============================================

// ---------- Session Types ----------
export interface Session {
  id: string;
  visitorId: string;
  fingerprint: string;
  startedAt: Date;
  lastActivityAt: Date;
  duration: number;
  pageviews: number;
  events: number;
  device: DeviceInfo;
  geo: GeoInfo;
  referrer: ReferrerInfo;
  utm: UTMParams;
  isBot: boolean;
  isBounce: boolean;
}

export interface SessionCreate extends Omit<Session, "id" | "duration" | "pageviews" | "events" | "isBounce"> {}

// ---------- Visitor Types ----------
export interface Visitor {
  id: string;
  fingerprint: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  totalSessions: number;
  totalPageviews: number;
  totalEvents: number;
  devices: DeviceInfo[];
  locations: GeoInfo[];
  tags: string[];
}

// ---------- Pageview Types ----------
export interface Pageview {
  id: string;
  sessionId: string;
  visitorId: string;
  path: string;
  title: string;
  referrer: string;
  timestamp: Date;
  timeOnPage: number;
  scrollDepth: number;
  device: DeviceInfo;
  performance: PerformanceMetrics;
}

export interface PageviewCreate extends Omit<Pageview, "id" | "timeOnPage" | "scrollDepth"> {}

// ---------- Event Types ----------
export type EventCategory =
  | "engagement"
  | "conversion"
  | "navigation"
  | "social"
  | "content"
  | "error"
  | "performance";

export type EventName =
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "newsletter_subscribe"
  | "newsletter_success"
  | "newsletter_error"
  | "cv_download"
  | "cv_view"
  | "article_view"
  | "article_completed"
  | "article_share"
  | "code_copied"
  | "social_click"
  | "external_link"
  | "internal_link"
  | "conference_view"
  | "conference_click"
  | "project_view"
  | "project_click"
  | "service_view"
  | "service_click"
  | "scroll_depth"
  | "time_on_page"
  | "page_visibility"
  | "error_occurred"
  | "custom";

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  visitorId: string;
  pageviewId?: string;
  category: EventCategory;
  name: EventName | string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: Date;
  path: string;
}

export interface EventCreate extends Omit<AnalyticsEvent, "id"> {}

// ---------- Device Types ----------
export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  colorDepth: number;
  touchSupport: boolean;
  language: string;
  languages: string[];
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  userAgent: string;
}

// ---------- Geo Types ----------
export interface GeoInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  source: "cloudflare" | "ipapi" | "unknown";
}

// ---------- UTM Types ----------
export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// ---------- Referrer Types ----------
export interface ReferrerInfo {
  raw: string;
  domain: string;
  type: "direct" | "organic" | "social" | "referral" | "email" | "paid" | "unknown";
  searchEngine?: string;
  socialNetwork?: string;
}

// ---------- Performance Types ----------
export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  inp: number;
  pageLoadTime: number;
  domContentLoaded: number;
  resourceCount: number;
  resourceSize: number;
}

// ---------- Analytics Config ----------
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackBots: boolean;
  sessionTimeout: number;
  heartbeatInterval: number;
  scrollThresholds: number[];
  excludePaths: string[];
  excludeIPs: string[];
  sampleRate: number;
  batchSize: number;
  flushInterval: number;
  retryAttempts: number;
  features: {
    fingerprinting: boolean;
    geolocation: boolean;
    performance: boolean;
    scrollTracking: boolean;
    heatmaps: boolean;
    sessionRecording: boolean;
  };
}

// ---------- Analytics State ----------
export interface AnalyticsState {
  initialized: boolean;
  sessionId: string | null;
  visitorId: string | null;
  fingerprint: string | null;
  currentPageviewId: string | null;
  device: DeviceInfo | null;
  geo: GeoInfo | null;
  consent: ConsentState;
  queue: QueuedItem[];
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp?: Date;
}

export interface QueuedItem {
  type: "pageview" | "event" | "session_update";
  data: unknown;
  timestamp: Date;
  attempts: number;
}

// ---------- Dashboard Types ----------
export interface DashboardMetrics {
  period: {
    start: Date;
    end: Date;
  };
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    totalSessions: number;
    totalPageviews: number;
    totalEvents: number;
    avgSessionDuration: number;
    bounceRate: number;
    returningVisitors: number;
  };
  trends: {
    visitorsChange: number;
    pageviewsChange: number;
    sessionDurationChange: number;
    bounceRateChange: number;
  };
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }>;
  topReferrers: Array<{
    domain: string;
    type: ReferrerInfo["type"];
    sessions: number;
    conversions: number;
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browsers: Array<{
    name: string;
    sessions: number;
    percentage: number;
  }>;
  countries: Array<{
    code: string;
    name: string;
    sessions: number;
    percentage: number;
  }>;
  events: Array<{
    name: string;
    category: EventCategory;
    count: number;
    uniqueUsers: number;
  }>;
}

// ---------- Real-time Types ----------
export interface RealTimeData {
  activeUsers: number;
  activeSessions: Session[];
  recentPageviews: Pageview[];
  recentEvents: AnalyticsEvent[];
  pageviewsPerMinute: number[];
  topActivePages: Array<{
    path: string;
    activeUsers: number;
  }>;
}

// ---------- Export Types ----------
export interface ExportOptions {
  format: "json" | "csv" | "xlsx";
  dateRange: {
    start: Date;
    end: Date;
  };
  includeVisitors: boolean;
  includeSessions: boolean;
  includePageviews: boolean;
  includeEvents: boolean;
}
