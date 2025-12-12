// ============================================
// Device Detection Service
// ============================================

import type { DeviceInfo } from "../types";
import { BOT_PATTERNS } from "../config";

// Cache device info
let deviceCache: DeviceInfo | null = null;

/**
 * Get device information
 * Detects browser, OS, device type, and capabilities
 */
export function getDeviceInfo(): DeviceInfo {
  // Return cached value if available
  if (deviceCache) {
    return deviceCache;
  }

  // Server-side fallback
  if (typeof window === "undefined") {
    return getServerDevice();
  }

  const ua = navigator.userAgent;
  const device: DeviceInfo = {
    type: detectDeviceType(ua),
    os: detectOS(ua),
    osVersion: detectOSVersion(ua),
    browser: detectBrowser(ua),
    browserVersion: detectBrowserVersion(ua),
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    colorDepth: screen.colorDepth,
    touchSupport: detectTouchSupport(),
    language: navigator.language,
    languages: [...navigator.languages],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === "1" || false,
    userAgent: ua,
  };

  deviceCache = device;
  return device;
}

/**
 * Detect device type from user agent
 */
function detectDeviceType(ua: string): DeviceInfo["type"] {
  const lowerUA = ua.toLowerCase();

  // Check for tablets first (more specific patterns)
  if (
    /ipad/.test(lowerUA) ||
    (/tablet/.test(lowerUA) && !/tablet pc/.test(lowerUA)) ||
    /playbook/.test(lowerUA) ||
    (/android/.test(lowerUA) && !/mobile/.test(lowerUA))
  ) {
    return "tablet";
  }

  // Check for mobile devices
  if (
    /mobile|iphone|ipod|android.*mobile|blackberry|opera mini|opera mobi|iemobile|wpdesktop|windows phone/i.test(
      ua
    )
  ) {
    return "mobile";
  }

  // Desktop by default
  return "desktop";
}

/**
 * Detect operating system
 */
function detectOS(ua: string): string {
  const patterns: [RegExp, string][] = [
    [/windows nt/i, "Windows"],
    [/macintosh|mac os x/i, "macOS"],
    [/linux/i, "Linux"],
    [/android/i, "Android"],
    [/iphone|ipad|ipod/i, "iOS"],
    [/cros/i, "Chrome OS"],
    [/ubuntu/i, "Ubuntu"],
    [/fedora/i, "Fedora"],
  ];

  for (const [pattern, name] of patterns) {
    if (pattern.test(ua)) {
      return name;
    }
  }

  return "Unknown";
}

/**
 * Detect OS version
 */
function detectOSVersion(ua: string): string {
  // Windows versions
  const windowsMatch = ua.match(/Windows NT (\d+\.\d+)/);
  if (windowsMatch) {
    const versions: Record<string, string> = {
      "10.0": "10/11",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
      "6.0": "Vista",
    };
    return versions[windowsMatch[1]] || windowsMatch[1];
  }

  // macOS version
  const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/);
  if (macMatch) {
    return macMatch[1].replace(/_/g, ".");
  }

  // iOS version
  const iosMatch = ua.match(/OS (\d+[._]\d+)/);
  if (iosMatch) {
    return iosMatch[1].replace(/_/g, ".");
  }

  // Android version
  const androidMatch = ua.match(/Android (\d+\.\d+)/);
  if (androidMatch) {
    return androidMatch[1];
  }

  return "";
}

/**
 * Detect browser name
 */
function detectBrowser(ua: string): string {
  // Order matters - check more specific patterns first
  const patterns: [RegExp, string][] = [
    [/edg\//i, "Edge"],
    [/opr\//i, "Opera"],
    [/firefox\//i, "Firefox"],
    [/brave/i, "Brave"],
    [/vivaldi/i, "Vivaldi"],
    [/samsung/i, "Samsung Internet"],
    [/chrome\//i, "Chrome"],
    [/safari\//i, "Safari"],
    [/msie|trident/i, "Internet Explorer"],
  ];

  for (const [pattern, name] of patterns) {
    if (pattern.test(ua)) {
      return name;
    }
  }

  return "Unknown";
}

/**
 * Detect browser version
 */
function detectBrowserVersion(ua: string): string {
  const browser = detectBrowser(ua);
  const patterns: Record<string, RegExp> = {
    Edge: /edg\/(\d+)/i,
    Opera: /opr\/(\d+)/i,
    Firefox: /firefox\/(\d+)/i,
    Chrome: /chrome\/(\d+)/i,
    Safari: /version\/(\d+)/i,
    "Internet Explorer": /(?:msie |rv:)(\d+)/i,
  };

  const pattern = patterns[browser];
  if (pattern) {
    const match = ua.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return "";
}

/**
 * Detect touch support
 */
function detectTouchSupport(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE/Edge specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Check if user agent is a known bot
 */
export function isBot(ua?: string): boolean {
  const userAgent = (ua || (typeof navigator !== "undefined" ? navigator.userAgent : "")).toLowerCase();

  return BOT_PATTERNS.some((pattern) => userAgent.includes(pattern));
}

/**
 * Get server-side device placeholder
 */
function getServerDevice(): DeviceInfo {
  return {
    type: "unknown",
    os: "Unknown",
    osVersion: "",
    browser: "Unknown",
    browserVersion: "",
    screenWidth: 0,
    screenHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    pixelRatio: 1,
    colorDepth: 0,
    touchSupport: false,
    language: "en",
    languages: ["en"],
    timezone: "UTC",
    cookiesEnabled: false,
    doNotTrack: false,
    userAgent: "",
  };
}

/**
 * Update viewport dimensions (call on resize)
 */
export function updateViewportDimensions(): void {
  if (deviceCache && typeof window !== "undefined") {
    deviceCache.viewportWidth = window.innerWidth;
    deviceCache.viewportHeight = window.innerHeight;
  }
}

/**
 * Clear device cache (for testing/debugging)
 */
export function clearDeviceCache(): void {
  deviceCache = null;
}

/**
 * Get device type emoji for display
 */
export function getDeviceEmoji(type: DeviceInfo["type"]): string {
  const emojis: Record<DeviceInfo["type"], string> = {
    desktop: "💻",
    mobile: "📱",
    tablet: "📱",
    unknown: "❓",
  };
  return emojis[type] || "❓";
}
