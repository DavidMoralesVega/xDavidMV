'use client';

import { useEffect } from 'react';
import { useImagePreload, usePreloadCriticalImages } from '@/hooks/useImagePreload';

/**
 * Image Preload Manager
 *
 * Initializes intelligent image preloading throughout the app
 * - Preloads images as user navigates
 * - Prioritizes above-the-fold images
 * - Optimizes resource loading based on scroll direction
 */
export default function ImagePreloadManager() {
  // Initialize intelligent image preloading
  const { preloadedCount } = useImagePreload({
    preloadDistance: 800, // Start preloading 800px before viewport
    maxPreload: 5, // Preload max 5 images at a time
    preloadDelay: 150, // Wait 150ms after scroll stops
  });

  // Preload critical above-the-fold images
  usePreloadCriticalImages([
    '/images/hero/01_hero-img.webp',
    '/favicon/icon-192x192.png',
  ]);

  // Log preload statistics (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ImagePreload] Active - preloaded:', preloadedCount, 'images');
    }
  }, [preloadedCount]);

  // Add performance observer to monitor image loading
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            const resourceEntry = entry as PerformanceResourceTiming;
            console.log(
              '[ImagePreload] Loaded:',
              entry.name.split('/').pop(),
              `(${Math.round(resourceEntry.duration)}ms)`
            );
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.warn('[ImagePreload] Performance observer failed:', error);
    }
  }, []);

  // Optimize Next.js Image component loading
  useEffect(() => {
    // Add intersection observer for Next.js images
    const observeNextImages = () => {
      const nextImages = document.querySelectorAll('img[loading="lazy"]');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;

              // Force load
              if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
              }

              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '400px', // Start loading 400px before viewport
          threshold: 0.01,
        }
      );

      nextImages.forEach((img) => {
        observer.observe(img);
      });

      return observer;
    };

    const observer = observeNextImages();

    // Re-observe when new images are added to DOM
    const mutationObserver = new MutationObserver(() => {
      observer.disconnect();
      observeNextImages();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
