"use client";

import { useEffect } from 'react';

// Helper to defer non-critical work
const scheduleIdleWork = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback, { timeout: 3000 });
  } else {
    setTimeout(callback, 1000);
  }
};

/**
 * Componente que inicializa Firebase en el cliente
 * Debe cargarse una sola vez en el layout principal
 */
export default function FirebaseInit() {
  useEffect(() => {
    // Defer Firebase initialization to not block main thread
    scheduleIdleWork(() => {
      const initFirebase = async () => {
        try {
          await import('@/lib/firebase');
          console.log('Firebase inicializado correctamente');
        } catch (error) {
          console.error('Error al inicializar Firebase:', error);
        }
      };
      initFirebase();
    });
  }, []);

  return null;
}
