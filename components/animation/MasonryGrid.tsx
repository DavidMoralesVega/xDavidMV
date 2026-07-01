"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MasonryGrid({
  children,
  className = "",
  itemSelector = ".gallery__item",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
}) {
  const isotopContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /////////////////////////////////////////////////////
    // Magnate Animation

    setTimeout(() => {
      const initIsotop = async () => {
        const Isotope = (await import("isotope-layout")).default;
        const imagesloaded = (await import("imagesloaded")).default;

        if (!isotopContainer.current) return;
        // Initialize Isotope in the mounted hook
        const isotope = new Isotope(isotopContainer.current, {
          itemSelector: itemSelector,
          layoutMode: "masonry", // or 'fitRows', depending on your layout needs
        });

        // Recompute GSAP ScrollTrigger positions after the masonry settles.
        // Isotope repositions items absolutely as images load, which invalidates
        // the reveal-trigger start positions created by useGsapScrollScaleAnimations
        // (a race that leaves cards stuck at opacity 0). Refreshing after layout —
        // including past the hook's requestIdleCallback window (~2s) — fixes it.
        const refresh = () => {
          try {
            ScrollTrigger.refresh();
          } catch {
            /* ScrollTrigger not registered yet — safe to ignore */
          }
        };

        imagesloaded(isotopContainer.current).on("progress", function () {
          // Trigger Isotope layout
          isotope.layout();
        });
        imagesloaded(isotopContainer.current).on("always", function () {
          isotope.layout();
          [100, 800, 2200].forEach((d) => setTimeout(refresh, d));
        });
      };
      initIsotop();
    }, 100);
  }, [itemSelector]);
  return (
    <div className={className} ref={isotopContainer} {...rest}>
      {children}
    </div>
  );
}
