import { useEffect } from "react";

/**
 * Hook para mejorar la navegación por teclado
 * Agrega visualización de foco mejorada y soporte para ESC
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    // Detectar si el usuario está navegando con teclado
    let isUsingKeyboard = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        isUsingKeyboard = true;
        document.body.classList.add("using-keyboard");
      }

      // ESC para cerrar modales/overlays
      if (e.key === "Escape") {
        // Trigger evento personalizado que los modales pueden escuchar
        window.dispatchEvent(new CustomEvent("escape-pressed"));
      }
    };

    const handleMouseDown = () => {
      isUsingKeyboard = false;
      document.body.classList.remove("using-keyboard");
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
}
