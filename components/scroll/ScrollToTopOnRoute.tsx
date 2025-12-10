"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Scroll to top when route changes
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      // Fallback for when lenis is not available
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
}
