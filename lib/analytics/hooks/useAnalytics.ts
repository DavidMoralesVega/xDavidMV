// ============================================
// Main Analytics Hook
// ============================================

"use client";

import { useContext } from "react";
import { AnalyticsContext } from "../providers/AnalyticsProvider";

/**
 * Main hook to access analytics functionality
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
}
