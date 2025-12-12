"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { useAnalytics } from "@/lib/analytics";

export default function WebVitals() {
  const { trackEvent, initialized } = useAnalytics();

  useReportWebVitals((metric) => {
    if (!initialized) return;

    const { name, value, rating, id } = metric;

    // Track to custom analytics (Firestore)
    trackEvent("web_vitals", "performance", {
      label: name,
      value: Math.round(value),
      properties: {
        metric_name: name,
        metric_value: Math.round(value),
        metric_rating: rating,
        metric_id: id,
      },
    });

    // Log en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${name}:`, {
        value: Math.round(value),
        rating,
      });
    }
  });

  // Track page load performance
  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    const measurePerformance = () => {
      // Navigation Timing API
      const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

      if (perfData) {
        const metrics = {
          dns_lookup: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
          tcp_connection: Math.round(perfData.connectEnd - perfData.connectStart),
          ttfb: Math.round(perfData.responseStart - perfData.requestStart),
          download_time: Math.round(perfData.responseEnd - perfData.responseStart),
          dom_interactive: Math.round(perfData.domInteractive - perfData.fetchStart),
          dom_complete: Math.round(perfData.domComplete - perfData.fetchStart),
          load_complete: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        };

        trackEvent("page_performance", "performance", {
          label: "Navigation Timing",
          properties: metrics,
        });
      }

      // Resource Timing (opcional - solo primeras 20 para no saturar)
      const resources = performance.getEntriesByType("resource").slice(0, 20);
      const resourcesByType: Record<string, number> = {};

      resources.forEach((resource) => {
        const type = (resource as PerformanceResourceTiming).initiatorType;
        resourcesByType[type] = (resourcesByType[type] || 0) + 1;
      });

      if (Object.keys(resourcesByType).length > 0) {
        trackEvent("resource_counts", "performance", {
          label: "Resource Types",
          properties: resourcesByType,
        });
      }
    };

    // Esperar a que la página esté completamente cargada
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance, { once: true });
    }
  }, [initialized, trackEvent]);

  return null; // No renderiza nada
}
