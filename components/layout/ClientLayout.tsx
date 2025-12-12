"use client";

import MobileMenu from "@/components/headers/MobileMenu";
import Header from "@/components/headers/Header";
import InitScroll from "@/components/scroll/InitScroll";
import LenisSmoothScroll from "@/components/scroll/LenisSmoothScroll";
import ScrollTop from "@/components/scroll/ScrollTop";
import ScrollToTopOnRoute from "@/components/scroll/ScrollToTopOnRoute";
import { AnalyticsProvider } from "@/lib/analytics";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import WebVitals from "@/components/analytics/WebVitals";
import SkipToContent from "@/components/accessibility/SkipToContent";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Mejora la navegación por teclado
  useKeyboardNavigation();

  return (
    <AnalyticsProvider>
      <SkipToContent />
      <MobileMenu />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <InitScroll />
      <ScrollTop />
      <ScrollToTopOnRoute />
      <LenisSmoothScroll />
      <AnalyticsTracker />
      <WebVitals />
    </AnalyticsProvider>
  );
}
