// ============================================
// Geolocation Service - IP & Location Detection
// ============================================

import type { GeoInfo } from "../types";

// Cache geolocation data to avoid repeated API calls
let geoCache: GeoInfo | null = null;
let geoCacheTimestamp: number = 0;
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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
  // Return cached value if still valid
  if (geoCache && Date.now() - geoCacheTimestamp < GEO_CACHE_DURATION) {
    return geoCache;
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

    if (!response.ok) {
      throw new Error(`ipapi.co returned ${response.status}`);
    }

    const data = await response.json();

    // Check for rate limit or error
    if (data.error) {
      console.warn("[Analytics] ipapi.co error:", data.reason);
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

    return geo;
  } catch (error) {
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
