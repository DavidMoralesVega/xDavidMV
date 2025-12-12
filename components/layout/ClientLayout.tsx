"use client";

import MobileMenu from "@/components/headers/MobileMenu";
import Header from "@/components/headers/Header";
import InitScroll from "@/components/scroll/InitScroll";
import LenisSmoothScroll from "@/components/scroll/LenisSmoothScroll";
import ScrollTop from "@/components/scroll/ScrollTop";
import ScrollToTopOnRoute from "@/components/scroll/ScrollToTopOnRoute";
import { AnalyticsProvider } from "@/lib/analytics";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AnalyticsProvider>
      <MobileMenu />
      <Header />
      {children}
      <InitScroll />
      <ScrollTop />
      <ScrollToTopOnRoute />
      <LenisSmoothScroll />
      <AnalyticsTracker />
    </AnalyticsProvider>
  );
}
