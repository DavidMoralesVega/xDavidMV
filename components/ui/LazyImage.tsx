'use client';

import { useState, useEffect, useRef, ComponentProps } from 'react';
import Image from 'next/image';

type NextImageProps = ComponentProps<typeof Image>;

interface LazyImageProps extends Omit<NextImageProps, 'loading' | 'priority'> {
  /**
   * Priority loading - loads immediately without lazy loading
   * Use for above-the-fold images
   */
  priority?: boolean;

  /**
   * Preload distance in pixels - start loading when this close to viewport
   * Default: 400px
   */
  rootMargin?: string;

  /**
   * Blur placeholder data URL or 'auto' to use default
   */
  blurDataURL?: string;

  /**
   * Callback when image enters viewport
   */
  onInView?: () => void;

  /**
   * Callback when image finishes loading
   */
  onLoad?: () => void;
}

/**
 * Intelligent Lazy Loading Image Component
 *
 * Features:
 * - Intersection Observer for smart lazy loading
 * - Configurable preload distance
 * - Priority loading for above-the-fold images
 * - Blur placeholder support
 * - Automatic resource optimization
 * - Preloads images as user navigates
 */
export default function LazyImage({
  priority = false,
  rootMargin = '400px',
  blurDataURL,
  placeholder,
  onInView,
  onLoad,
  className = '',
  alt,
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip intersection observer if priority loading
    if (priority) return;

    const element = imgRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            onInView?.();

            // Preload next images in the same container
            preloadNearbyImages(element);

            // Disconnect once image is in view
            observer.disconnect();
          }
        });
      },
      {
        rootMargin, // Start loading before image enters viewport
        threshold: 0.01, // Trigger as soon as 1% is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin, onInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Generate blur placeholder if not provided
  const computedPlaceholder = placeholder || (blurDataURL ? 'blur' : 'empty');
  const computedBlurDataURL =
    blurDataURL ||
    (placeholder === 'blur' ? generateBlurPlaceholder() : undefined);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-wrapper ${className}`}
      style={{ position: 'relative' }}
    >
      {isInView && (
        <Image
          {...props}
          alt={alt}
          loading={priority ? undefined : 'lazy'}
          priority={priority}
          placeholder={computedPlaceholder as 'blur' | 'empty'}
          blurDataURL={computedBlurDataURL}
          onLoad={handleLoad}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${className}`}
        />
      )}

      {!isInView && (
        <div
          className="lazy-image-placeholder"
          style={{
            width: typeof props.width === 'number' ? `${props.width}px` : '100%',
            height: typeof props.height === 'number' ? `${props.height}px` : '100%',
            backgroundColor: '#f0f0f0',
          }}
        />
      )}

      <style jsx>{`
        .lazy-image-wrapper {
          overflow: hidden;
        }

        .lazy-image.loading {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .lazy-image.loaded {
          opacity: 1;
        }

        .lazy-image-placeholder {
          background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Preload nearby images that are likely to be viewed next
 */
function preloadNearbyImages(element: HTMLElement) {
  try {
    // Find parent container
    const container = element.closest('.mxd-section, .portfolio-grid, .blog-grid');
    if (!container) return;

    // Find other lazy images in the same container
    const nearbyImages = container.querySelectorAll('.lazy-image-wrapper img[loading="lazy"]');

    nearbyImages.forEach((img, index) => {
      // Preload next 2-3 images
      if (index < 3) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = (img as HTMLImageElement).src;
        document.head.appendChild(link);
      }
    });
  } catch (error) {
    console.warn('Error preloading nearby images:', error);
  }
}

/**
 * Generate a default blur placeholder (tiny base64 encoded image)
 */
function generateBlurPlaceholder(): string {
  // Simple 10x10 gray square as base64
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
}

/**
 * Hook to detect when user is likely to scroll to a section
 * Can be used to preload section images
 */
export function usePreloadSectionImages(sectionId: string) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            // Section is mostly visible, preload its images
            const images = section.querySelectorAll('img[loading="lazy"]');
            images.forEach((img) => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = (img as HTMLImageElement).src;
              document.head.appendChild(link);
            });
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [sectionId]);
}
