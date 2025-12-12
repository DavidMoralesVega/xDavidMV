// ============================================
// Analytics Admin Dashboard
// ============================================

import { Metadata } from "next";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Panel de analytics del sitio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsAdminPage() {
  return <AnalyticsDashboard />;
}
