import "../public/css/styles.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { Metadata, Viewport } from "next";
import {
  siteConfig,
  generatePersonSchema,
  generateWebSiteSchema,
  generateProfilePageSchema,
  generateProfessionalServiceSchema,
  generateFAQSchema,
  JsonLd,
} from "@/lib/seo";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import FirebaseInit from "@/components/firebase/FirebaseInit";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efefef" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: "technology",
  classification: "Personal Portfolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "es-BO": siteConfig.url,
      "es": siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/img/hero/01_hero-img.webp",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/img/hero/01_hero-img.webp"],
  },
  icons: {
    icon: [
      { url: "/img/favicon/favicon.ico", sizes: "any" },
      { url: "/img/favicon/icon.svg", type: "image/svg+xml" },
      { url: "/img/favicon/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/favicon/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/favicon/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/img/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/img/favicon/icon.svg", color: "#efefef" },
    ],
  },
  manifest: "/img/favicon/manifest.webmanifest",
  verification: {
    // Google Search Console - reemplazar con tu código real
    google: "GOOGLE_SITE_VERIFICATION_CODE",
    // Bing Webmaster Tools - reemplazar con tu código real
    other: {
      "msvalidate.01": "BING_SITE_VERIFICATION_CODE",
    },
  },
  other: {
    // Microsoft Tile
    "msapplication-TileColor": "#efefef",
    "msapplication-TileImage": "/img/favicon/icon-192x192.png",
    // Apple Web App
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteConfig.name,
    // Format detection
    "format-detection": "telephone=no",
  },
};

const setColorSchemeScript = `
(function() {
  try {
    var scheme = localStorage.getItem('color-scheme') || 'light';
    document.documentElement.setAttribute('color-scheme', scheme);
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    generatePersonSchema(),
    generateWebSiteSchema(),
    generateProfilePageSchema(),
    generateProfessionalServiceSchema(),
    generateFAQSchema(),
  ];

  return (
    <html suppressHydrationWarning lang="es" className="no-touch">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setColorSchemeScript }} />
        <JsonLd data={structuredData} />
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning>
        <FirebaseInit />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
