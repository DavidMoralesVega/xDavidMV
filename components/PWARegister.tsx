'use client';

import { useEffect } from 'react';

/**
 * Previously registered a service worker. Now actively tears down any
 * lingering SW + Cache Storage entries because a prior version was
 * serving corrupted (double-encoded) HTML to visitors.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((r) => r.unregister()));
        }
      } catch {}

      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {}
    })();
  }, []);

  return null;
}

export function useIsPWA() {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore - iOS Safari
    window.navigator?.standalone === true
  );
}
