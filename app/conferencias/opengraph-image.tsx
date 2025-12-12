import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

export const alt = "Conferencias - David Morales Vega";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            DM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              David Morales Vega
            </div>
            <div style={{ fontSize: "16px", color: "#a1a1aa" }}>
              Conferencias · Eventos
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              color: "#fff",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Conferencias y Talleres
          </h1>
          <p style={{ fontSize: "28px", color: "#a1a1aa", lineHeight: 1.4, margin: 0, maxWidth: "800px" }}>
            +16 presentaciones en eventos tecnológicos de Bolivia y Latinoamérica
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "16px", zIndex: 1 }}>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "8px",
              color: "#818cf8",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            🎤 Speaker
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              color: "#c084fc",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            🇧🇴 Bolivia
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
