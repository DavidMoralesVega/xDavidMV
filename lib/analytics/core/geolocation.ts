// ============================================
// Geolocation Service - IP & Location Detection
// ============================================

import type { GeoInfo } from "../types";

// Cache geolocation data to avoid repeated API calls
let geoCache: GeoInfo | null = null;
let geoCacheTimestamp: number = 0;
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const GEO_STORAGE_KEY = "geo_cache";
const GEO_RATE_LIMIT_KEY = "geo_rate_limited";

/**
 * Get cached geo from localStorage
 */
function getStoredGeo(): { geo: GeoInfo; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(GEO_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

/**
 * Store geo in localStorage
 */
function storeGeo(geo: GeoInfo): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      GEO_STORAGE_KEY,
      JSON.stringify({ geo, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if rate limited (to avoid repeated 429 errors)
 */
function isRateLimited(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const limited = localStorage.getItem(GEO_RATE_LIMIT_KEY);
    if (limited) {
      const limitedUntil = parseInt(limited, 10);
      if (Date.now() < limitedUntil) {
        return true;
      }
      localStorage.removeItem(GEO_RATE_LIMIT_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

/**
 * Mark as rate limited for 1 hour
 */
function setRateLimited(): void {
  if (typeof window === "undefined") return;
  try {
    // Wait 1 hour before retrying after 429
    localStorage.setItem(
      GEO_RATE_LIMIT_KEY,
      String(Date.now() + 60 * 60 * 1000)
    );
  } catch {
    // Ignore storage errors
  }
}

/**
 * Default/unknown geo info
 */
const unknownGeo: GeoInfo = {
  ip: "",
  country: "Unknown",
  countryCode: "XX",
  region: "",
  regionCode: "",
  city: "",
  postalCode: "",
  latitude: 0,
  longitude: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  isp: "",
  org: "",
  asn: "",
  source: "unknown",
};

/**
 * Get geolocation info
 * Uses ipapi.co for client-side geolocation (static export compatible)
 */
export async function getGeolocation(): Promise<GeoInfo> {
  // Return memory cached value if still valid
  if (geoCache && Date.now() - geoCacheTimestamp < GEO_CACHE_DURATION) {
    return geoCache;
  }

  // Check localStorage cache
  const stored = getStoredGeo();
  if (stored && Date.now() - stored.timestamp < GEO_CACHE_DURATION) {
    geoCache = stored.geo;
    geoCacheTimestamp = stored.timestamp;
    return stored.geo;
  }

  // Check if rate limited - return unknown geo silently
  if (isRateLimited()) {
    return unknownGeo;
  }

  // Client-side only: use ipapi.co directly
  return getGeoFromIpapi();
}

/**
 * Get geolocation from ipapi.co (free tier: 1000 req/day)
 */
async function getGeoFromIpapi(): Promise<GeoInfo> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      setRateLimited();
      return unknownGeo;
    }

    if (!response.ok) {
      throw new Error(`ipapi.co returned ${response.status}`);
    }

    const data = await response.json();

    // Check for rate limit or error in response body
    if (data.error) {
      if (data.reason === "RateLimited") {
        setRateLimited();
      }
      return unknownGeo;
    }

    const geo: GeoInfo = {
      ip: data.ip || "",
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "XX",
      region: data.region || "",
      regionCode: data.region_code || "",
      city: data.city || "",
      postalCode: data.postal || "",
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      timezone: data.timezone || unknownGeo.timezone,
      isp: data.org || "",
      org: data.org || "",
      asn: data.asn || "",
      source: "ipapi",
    };

    geoCache = geo;
    geoCacheTimestamp = Date.now();
    storeGeo(geo);

    return geo;
  } catch (error) {
    // Don't log 429 errors to console - they're handled silently
    if (error instanceof Error && error.message.includes("429")) {
      setRateLimited();
      return unknownGeo;
    }
    console.error("[Analytics] ipapi.co fetch failed:", error);
    return unknownGeo;
  }
}

/**
 * Parse Cloudflare headers for geolocation
 * Used server-side in API route
 */
export function parseCloudflareHeaders(headers: Headers): Partial<GeoInfo> {
  return {
    ip: headers.get("cf-connecting-ip") || headers.get("x-forwarded-for")?.split(",")[0] || "",
    country: headers.get("cf-ipcountry") || "",
    countryCode: headers.get("cf-ipcountry") || "",
    city: headers.get("cf-ipcity") || "",
    region: headers.get("cf-region") || "",
    regionCode: headers.get("cf-region-code") || "",
    latitude: parseFloat(headers.get("cf-iplat") || "0"),
    longitude: parseFloat(headers.get("cf-iplon") || "0"),
    timezone: headers.get("cf-timezone") || "",
    source: "cloudflare" as const,
  };
}

/**
 * Check if geo info is from Cloudflare (has required headers)
 */
export function hasCloudflareGeo(headers: Headers): boolean {
  return !!(headers.get("cf-connecting-ip") && headers.get("cf-ipcountry"));
}

/**
 * Clear geo cache (for testing/debugging)
 */
export function clearGeoCache(): void {
  geoCache = null;
  geoCacheTimestamp = 0;
}

/**
 * Get country name from code
 */
export function getCountryName(code: string): string {
  try {
    const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}
