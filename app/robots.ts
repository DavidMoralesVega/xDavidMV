import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Reglas generales para todos los bots
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/private/",
          "/_next/",
          "/admin/",
          "/preview/",
        ],
      },
      // Googlebot - Acceso completo
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      // Bingbot - Acceso completo
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      // GPTBot (OpenAI/ChatGPT) - Permitir indexación
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // Google-Extended (Gemini/Bard) - Permitir
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      // Claude Bot (Anthropic) - Permitir
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      // CCBot (Common Crawl) - Permitir
      {
        userAgent: "CCBot",
        allow: "/",
      },
      // Scrapers de SEO - Limitar agresividad
      {
        userAgent: "SemrushBot",
        allow: "/",
        // crawlDelay no está soportado en MetadataRoute.Robots
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
      },
      // Bloquear bots maliciosos conocidos
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
