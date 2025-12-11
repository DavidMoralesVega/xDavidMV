import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

// Para static export, necesitamos configurar revalidate
export const runtime = "edge";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parámetros para personalizar la imagen
    const title = searchParams.get("title") || "David Morales Vega";
    const description =
      searchParams.get("description") ||
      "Solutions Architect & Tech Lead | Angular, NestJS, Microservicios";
    const type = searchParams.get("type") || "default"; // default, blog, conferencias

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

          {/* Header con logo/nombre */}
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
                background:
                  "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                David Morales Vega
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#a1a1aa",
                  marginTop: "4px",
                }}
              >
                {type === "blog"
                  ? "Blog · Artículo"
                  : type === "conferencias"
                    ? "Conferencias · Eventos"
                    : "Solutions Architect & Tech Lead"}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 1,
              maxWidth: "900px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? "52px" : "64px",
                fontWeight: "800",
                color: "#fff",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#a1a1aa",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {description}
            </p>
          </div>

          {/* Footer con badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              zIndex: 1,
            }}
          >
            {type === "blog" ? (
              <>
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
                  📝 Blog
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
                  💻 Tech
                </div>
              </>
            ) : type === "conferencias" ? (
              <>
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
              </>
            ) : (
              <>
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
                  Angular · NestJS
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
                  🇧🇴 Oruro, Bolivia
                </div>
              </>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
