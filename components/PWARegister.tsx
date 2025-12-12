'use client';

import { useEffect } from 'react';

/**
 * PWA Service Worker Registration Component
 *
 * Registers the service worker for offline support and caching
 * Only runs in production and in browser environment
 */
export function PWARegister() {
  useEffect(() => {
    // Only register service worker in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[PWA] Service Worker registration skipped in development');
      return;
    }

    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Wait for the page to load before registering
      window.addEventListener('load', () => {
        registerServiceWorker();
      });
    } else {
      console.warn('[PWA] Service Worker not supported in this browser');
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log('[PWA] Registering Service Worker...');

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered successfully:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          console.log('[PWA] New Service Worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('[PWA] New content available, please refresh');

              // Optionally show a notification to the user
              showUpdateNotification();
            }
          });
        }
      });

      // Check for updates periodically (every hour)
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = () => {
    // You can integrate with a toast library here
    // For now, we'll just log it
    console.log('[PWA] Update available! Reload to get the latest version.');

    // Optional: Auto-reload after a delay
    // setTimeout(() => window.location.reload(), 3000);
  };

  // This component doesn't render anything
  return null;
}

/**
 * Hook to check if app is installed as PWA
 */
export function useIsPWA() {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore - iOS Safari
    window.navigator?.standalone === true
  );
}

/**
 * Hook to prompt PWA installation
 */
export function usePWAInstall() {
  useEffect(() => {
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      console.log('[PWA] Installation prompt available');

      // Optionally, show a custom install button to the user
      // You can dispatch a custom event or update state here
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
}
