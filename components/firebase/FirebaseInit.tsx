"use client";

import { useEffect } from 'react';

/**
 * Componente que inicializa Firebase en el cliente
 * Debe cargarse una sola vez en el layout principal
 */
export default function FirebaseInit() {
  useEffect(() => {
    // Importar dinámicamente para evitar SSR
    const initFirebase = async () => {
      try {
        // Importar la configuración de Firebase
        await import('@/lib/firebase');
        console.log('🔥 Firebase inicializado correctamente');
      } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
      }
    };

    initFirebase();
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
