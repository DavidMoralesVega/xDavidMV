'use client';

import { useEffect, useCallback, useRef } from 'react';

interface ImagePreloadOptions {
  /**
   * Distance from viewport to start preloading (in pixels)
   * Default: 800px
   */
  preloadDistance?: number;

  /**
   * Maximum number of images to preload at once
   * Default: 5
   */
  maxPreload?: number;

  /**
   * Delay before preloading (in ms) - prevents preloading during fast scrolling
   * Default: 150ms
   */
  preloadDelay?: number;
}

/**
 * Intelligent Image Preloading Hook
 *
 * Preloads images as user navigates through the page
 * Features:
 * - Detects scroll direction
 * - Preloads images in scroll direction
 * - Throttles preloading to avoid overwhelming network
 * - Prioritizes images based on distance from viewport
 */
export function useImagePreload(options: ImagePreloadOptions = {}) {
  const {
    preloadDistance = 800,
    maxPreload = 5,
    preloadDelay = 150,
  } = options;

  const lastScrollY = useRef(0);
  const preloadTimer = useRef<NodeJS.Timeout | null>(null);
  const preloadedUrls = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((url: string) => {
    // Skip if already preloaded
    if (preloadedUrls.current.has(url)) return;

    // Create link element for preloading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;

    // Add crossorigin if needed
    if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
    preloadedUrls.current.add(url);

    console.log('[ImagePreload] Preloading:', url);
  }, []);

  const getImageUrl = (img: HTMLImageElement): string => {
    // Get the actual image URL (could be srcset, src, or data-src)
    if (img.currentSrc) return img.currentSrc;
    if (img.src) return img.src;
    if (img.dataset.src) return img.dataset.src;
    return '';
  };

  const preloadNearbyImages = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
    lastScrollY.current = scrollY;

    // Get all images on page
    const images = Array.from(document.querySelectorAll('img'));

    // Filter images based on scroll direction and distance
    const imagesToPreload = images
      .map((img) => {
        const rect = img.getBoundingClientRect();
        const distanceFromViewport = scrollDirection === 'down'
          ? rect.top - viewportHeight
          : viewportHeight - rect.bottom;

        return {
          img,
          distance: distanceFromViewport,
          url: getImageUrl(img),
        };
      })
      .filter(({ distance, url }) => {
        // Only preload images in scroll direction within preload distance
        return (
          url &&
          distance > 0 &&
          distance < preloadDistance &&
          !preloadedUrls.current.has(url)
        );
      })
      .sort((a, b) => a.distance - b.distance) // Closest first
      .slice(0, maxPreload); // Limit number of preloads

    // Preload images
    imagesToPreload.forEach(({ url }) => {
      preloadImage(url);
    });
  }, [preloadDistance, maxPreload, preloadImage]);

  const handleScroll = useCallback(() => {
    // Clear existing timer
    if (preloadTimer.current) {
      clearTimeout(preloadTimer.current);
    }

    // Set new timer - preload after user stops scrolling for a bit
    preloadTimer.current = setTimeout(() => {
      preloadNearbyImages();
    }, preloadDelay);
  }, [preloadNearbyImages, preloadDelay]);

  useEffect(() => {
    // Initial preload
    preloadNearbyImages();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Listen to hash changes (for anchor navigation)
    window.addEventListener('hashchange', preloadNearbyImages);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', preloadNearbyImages);

      if (preloadTimer.current) {
        clearTimeout(preloadTimer.current);
      }
    };
  }, [handleScroll, preloadNearbyImages]);

  return {
    preloadImage,
    preloadedCount: preloadedUrls.current.size,
  };
}

/**
 * Hook to preload images for a specific section
 */
export function usePreloadSection(sectionId: string | null) {
  useEffect(() => {
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    // Preload all images in the section
    const images = section.querySelectorAll('img');

    images.forEach((img) => {
      const url = img.src || img.dataset.src;
      if (!url) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });

    console.log(`[ImagePreload] Preloaded section: ${sectionId}`);
  }, [sectionId]);
}

/**
 * Hook to preload critical above-the-fold images
 */
export function usePreloadCriticalImages(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.forEach((url) => {
      if (!url) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    console.log('[ImagePreload] Preloaded critical images:', imageUrls.length);
  }, [imageUrls]);
}

/**
 * Hook to optimize background images
 */
export function usePreloadBackgroundImages(selector: string = '[data-bg]') {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      const bgUrl =
        (element as HTMLElement).dataset.bg ||
        getComputedStyle(element).backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];

      if (bgUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = bgUrl;
        document.head.appendChild(link);
      }
    });
  }, [selector]);
}
