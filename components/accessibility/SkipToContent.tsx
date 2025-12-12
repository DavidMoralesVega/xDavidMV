// ============================================
// Skip to Main Content Link
// Mejora la accesibilidad para lectores de pantalla
// ============================================

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: "absolute",
        left: "-9999px",
        zIndex: 999,
        padding: "1rem 1.5rem",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        textDecoration: "none",
        borderRadius: "0.25rem",
        border: "2px solid var(--color-accent)",
        fontWeight: 600,
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = "1rem";
        e.currentTarget.style.top = "1rem";
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = "-9999px";
      }}
    >
      Saltar al contenido principal
    </a>
  );
}
