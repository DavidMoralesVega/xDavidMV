import { Metadata } from "next";
import { siteConfig } from "./config";

// ============================================
// Metadata Helpers
// ============================================

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/img/hero/01_hero-img.webp",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...(tags || [])],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: siteConfig.locale,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
      creator: "@moralesvegadavid",
    },
  };

  if (type === "article" && metadata.openGraph) {
    (metadata.openGraph as Record<string, unknown>).publishedTime =
      publishedTime;
    (metadata.openGraph as Record<string, unknown>).modifiedTime = modifiedTime;
    (metadata.openGraph as Record<string, unknown>).authors =
      authors || [siteConfig.author.name];
    (metadata.openGraph as Record<string, unknown>).tags = tags;
  }

  return metadata;
}
