"use client";
import React, { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      // Primero checar localStorage
      const stored = localStorage.getItem("color-scheme") as "light" | "dark" | null;
      if (stored) return stored;

      // Si no hay preferencia guardada, usar preferencia del sistema
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    setShowSwitcher(true);
  }, []);

  useEffect(() => {
    // Aplicar color scheme
    const currentScheme = document.documentElement.getAttribute("color-scheme");
    if (currentScheme !== colorScheme) {
      document.documentElement.setAttribute("color-scheme", colorScheme);
    }
    if (localStorage.getItem("color-scheme") !== colorScheme) {
      localStorage.setItem("color-scheme", colorScheme);
    }
  }, [colorScheme]);

  // Sincronización entre tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "color-scheme" && e.newValue) {
        setColorScheme(e.newValue as "light" | "dark");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Detectar cambios en preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia guardada
      if (!localStorage.getItem("color-scheme")) {
        setColorScheme(e.matches ? "dark" : "light");
      }
    };

    // Navegadores modernos
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleColorSwitch = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  return (
    <>
      {showSwitcher ? (
        <button
          id="color-switcher"
          className="mxd-color-switcher"
          type="button"
          role="switch"
          aria-label="light/dark mode"
          aria-checked={colorScheme === "dark"}
          onClick={handleColorSwitch}
        >
          <i
            className={
              colorScheme === "dark"
                ? "ph-bold ph-sun-horizon"
                : "ph-bold ph-moon-stars "
            }
          />
        </button>
      ) : (
        ""
      )}{" "}
    </>
  );
}
