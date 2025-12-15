"use client";

import dynamic from "next/dynamic";
import MobileMenu from "@/components/headers/MobileMenu";
import Header from "@/components/headers/Header";
import ScrollTop from "@/components/scroll/ScrollTop";
import ScrollToTopOnRoute from "@/components/scroll/ScrollToTopOnRoute";
import { AnalyticsProvider } from "@/lib/analytics";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import WebVitals from "@/components/analytics/WebVitals";
import SkipToContent from "@/components/accessibility/SkipToContent";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load heavy GSAP animation components (not critical for initial render)
const InitScroll = dynamic(() => import("@/components/scroll/InitScroll"), {
  ssr: false,
});
const LenisSmoothScroll = dynamic(
  () => import("@/components/scroll/LenisSmoothScroll"),
  { ssr: false }
);

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
      <ErrorBoundary>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </ErrorBoundary>
      <InitScroll />
      <ScrollTop />
      <ScrollToTopOnRoute />
      <LenisSmoothScroll />
      <AnalyticsTracker />
      <WebVitals />
    </AnalyticsProvider>
  );
}
