// ============================================
// Session Management Service
// ============================================

import type { Session, SessionCreate, ReferrerInfo, UTMParams } from "../types";
import { analyticsConfig, STORAGE_KEYS, SOCIAL_DOMAINS, SEARCH_ENGINES } from "../config";
import { getFingerprint } from "./fingerprint";
import { getDeviceInfo, isBot } from "./device";
import { getGeolocation } from "./geolocation";

// Session state
let currentSession: Session | null = null;
let sessionHeartbeat: ReturnType<typeof setInterval> | null = null;

/**
 * Generate unique ID
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

/**
 * Get visitor ID (persistent across sessions)
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return generateId();
  }

  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);

  if (!visitorId) {
    visitorId = `v-${generateId()}`;
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }

  return visitorId;
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return generateId();
  }

  // Check for existing session
  const storedSessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const lastActivity = sessionStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);

  // Check if session is still valid (not expired)
  if (storedSessionId && lastActivity) {
    const lastActivityTime = parseInt(lastActivity, 10);
    const timeSinceActivity = Date.now() - lastActivityTime;

    if (timeSinceActivity < analyticsConfig.sessionTimeout) {
      // Update last activity
      sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
      return storedSessionId;
    }
  }

  // Create new session
  const newSessionId = `s-${generateId()}`;
  sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
  sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());

  // Reset current session to trigger new session creation
  currentSession = null;

  return newSessionId;
}

/**
 * Parse UTM parameters from URL
 * Returns only defined values (Firestore doesn't accept undefined)
 */
export function parseUTMParams(): UTMParams {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const term = params.get("utm_term");
  const content = params.get("utm_content");

  // Only add defined values
  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (term) utm.term = term;
  if (content) utm.content = content;

  return utm;
}

/**
 * Parse referrer information
 */
export function parseReferrer(): ReferrerInfo {
  if (typeof window === "undefined" || !document.referrer) {
    return {
      raw: "",
      domain: "",
      type: "direct",
    };
  }

  const referrer = document.referrer;
  let domain = "";

  try {
    const url = new URL(referrer);
    domain = url.hostname.replace(/^www\./, "");
  } catch {
    domain = "";
  }

  // Check if internal referrer
  if (domain === window.location.hostname.replace(/^www\./, "")) {
    return {
      raw: referrer,
      domain,
      type: "direct",
    };
  }

  // Check for social networks
  for (const [socialDomain, socialName] of Object.entries(SOCIAL_DOMAINS)) {
    if (domain.includes(socialDomain)) {
      return {
        raw: referrer,
        domain,
        type: "social",
        socialNetwork: socialName,
      };
    }
  }

  // Check for search engines
  for (const [searchDomain, searchName] of Object.entries(SEARCH_ENGINES)) {
    if (domain.includes(searchDomain)) {
      return {
        raw: referrer,
        domain,
        type: "organic",
        searchEngine: searchName,
      };
    }
  }

  // Check UTM for paid traffic
  const utm = parseUTMParams();
  if (utm.medium === "cpc" || utm.medium === "paid" || utm.medium === "ppc") {
    return {
      raw: referrer,
      domain,
      type: "paid",
    };
  }

  // Check UTM for email
  if (utm.medium === "email") {
    return {
      raw: referrer,
      domain,
      type: "email",
    };
  }

  // Default to referral
  return {
    raw: referrer,
    domain,
    type: domain ? "referral" : "direct",
  };
}

/**
 * Create new session
 */
export async function createSession(): Promise<Session> {
  const sessionId = getSessionId();
  const visitorId = getVisitorId();
  const fingerprint = await getFingerprint();
  const device = getDeviceInfo();
  const geo = await getGeolocation();
  const referrer = parseReferrer();
  const utm = parseUTMParams();
  const now = new Date();

  const session: Session = {
    id: sessionId,
    visitorId,
    fingerprint,
    startedAt: now,
    lastActivityAt: now,
    duration: 0,
    pageviews: 0,
    events: 0,
    device,
    geo,
    referrer,
    utm,
    isBot: isBot(),
    isBounce: true,
  };

  currentSession = session;

  // Start heartbeat
  startHeartbeat();

  return session;
}

/**
 * Get current session (or create if none exists)
 */
export async function getSession(): Promise<Session> {
  // Check if session ID changed (e.g., timeout)
  const currentSessionId = getSessionId();

  if (currentSession && currentSession.id === currentSessionId) {
    return currentSession;
  }

  // Create new session
  return createSession();
}

/**
 * Update session activity
 */
export function updateSessionActivity(): void {
  if (!currentSession) return;

  const now = new Date();
  currentSession.lastActivityAt = now;
  currentSession.duration = now.getTime() - currentSession.startedAt.getTime();

  // Update storage
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  }
}

/**
 * Increment pageview count
 */
export function incrementPageviews(): void {
  if (!currentSession) return;

  currentSession.pageviews++;

  // No longer a bounce if more than 1 pageview
  if (currentSession.pageviews > 1) {
    currentSession.isBounce = false;
  }
}

/**
 * Increment event count
 */
export function incrementEvents(): void {
  if (!currentSession) return;

  currentSession.events++;

  // Interaction counts against bounce
  if (currentSession.events > 0 && currentSession.pageviews >= 1) {
    currentSession.isBounce = false;
  }
}

/**
 * Start session heartbeat
 */
function startHeartbeat(): void {
  if (sessionHeartbeat) {
    clearInterval(sessionHeartbeat);
  }

  sessionHeartbeat = setInterval(() => {
    updateSessionActivity();
  }, analyticsConfig.heartbeatInterval);
}

/**
 * End session (call on page unload)
 */
export function endSession(): Session | null {
  if (sessionHeartbeat) {
    clearInterval(sessionHeartbeat);
    sessionHeartbeat = null;
  }

  updateSessionActivity();

  const session = currentSession;
  currentSession = null;

  return session;
}

/**
 * Get session data for saving
 */
export function getSessionData(): SessionCreate | null {
  if (!currentSession) return null;

  const { id, duration, pageviews, events, isBounce, ...data } = currentSession;
  return data as SessionCreate;
}

/**
 * Check if this is a new visitor (first session)
 */
export function isNewVisitor(): boolean {
  if (typeof window === "undefined") return true;

  const visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);

  // If we have a visitor ID but this is a new session, they're returning
  return !visitorId || visitorId === sessionId;
}

/**
 * Get session duration in human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
