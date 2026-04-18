"use client";

import { useEffect } from 'react';
import { initializeFirebase } from '@/lib/firebase';

/**
 * Componente que inicializa Firebase en el cliente
 * Debe cargarse una sola vez en el layout principal
 */
export default function FirebaseInit() {
  useEffect(() => {
    // Initialize Firebase immediately on mount
    initializeFirebase().catch(() => {
      // Silently ignore initialization errors
    });
  }, []);

  return null;
}
