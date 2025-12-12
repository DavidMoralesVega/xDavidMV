// ============================================
// Fingerprint Service - FingerprintJS Integration
// ============================================

import FingerprintJS, { type Agent } from "@fingerprintjs/fingerprintjs";
import { STORAGE_KEYS } from "../config";

let fpAgent: Agent | null = null;
let fingerprintCache: string | null = null;

/**
 * Initialize FingerprintJS agent
 * Uses lazy loading for performance
 */
async function getAgent(): Promise<Agent> {
  if (!fpAgent) {
    fpAgent = await FingerprintJS.load();
  }
  return fpAgent;
}

/**
 * Get or generate device fingerprint
 * Caches result in memory and localStorage for performance
 */
export async function getFingerprint(): Promise<string> {
  // Return cached value if available
  if (fingerprintCache) {
    return fingerprintCache;
  }

  // Check localStorage for existing fingerprint
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.FINGERPRINT);
    if (stored) {
      fingerprintCache = stored;
      return stored;
    }
  }

  try {
    const agent = await getAgent();
    const result = await agent.get();

    // Use visitorId from FingerprintJS
    fingerprintCache = result.visitorId;

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.FINGERPRINT, fingerprintCache);
    }

    return fingerprintCache;
  } catch (error) {
    console.error("[Analytics] Fingerprint generation failed:", error);
    // Fallback to a simple hash-based fingerprint
    return generateFallbackFingerprint();
  }
}

/**
 * Generate fallback fingerprint when FingerprintJS fails
 * Uses available browser characteristics
 */
function generateFallbackFingerprint(): string {
  if (typeof window === "undefined") {
    return `server-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
  ];

  // Simple hash function
  const hash = components
    .join("|")
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

  const fingerprint = `fallback-${Math.abs(hash).toString(36)}`;
  fingerprintCache = fingerprint;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.FINGERPRINT, fingerprint);
  }

  return fingerprint;
}

/**
 * Get extended fingerprint components for analysis
 * Returns detailed device characteristics
 */
export async function getExtendedFingerprint(): Promise<{
  visitorId: string;
  confidence: number;
  components: Record<string, unknown>;
}> {
  try {
    const agent = await getAgent();
    const result = await agent.get();

    return {
      visitorId: result.visitorId,
      confidence: result.confidence.score,
      components: result.components as unknown as Record<string, unknown>,
    };
  } catch (error) {
    console.error("[Analytics] Extended fingerprint failed:", error);
    return {
      visitorId: await getFingerprint(),
      confidence: 0,
      components: {},
    };
  }
}

/**
 * Clear fingerprint cache (for testing/debugging)
 */
export function clearFingerprintCache(): void {
  fingerprintCache = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.FINGERPRINT);
  }
}
