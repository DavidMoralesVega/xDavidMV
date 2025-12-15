"use client";
import ReactLenis, { useLenis } from "lenis/react";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisSmoothScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Ensure scrollbar is visible
    document.body.style.overflow = "auto";

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Refresh ScrollTrigger after load
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    // Handle resize
    const handleResize = () => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [lenis]);

  // Disable on iOS for native scroll
  if (
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  ) {
    return null;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
      }}
    />
  );
}
