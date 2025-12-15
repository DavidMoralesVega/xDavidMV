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
  generateLocalBusinessSchema,
  JsonLd,
} from "@/lib/seo";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import FirebaseInit from "@/components/firebase/FirebaseInit";
import { PWARegister } from "@/components/PWARegister";
import ImagePreloadManager from "@/components/ImagePreloadManager";

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
        url: "/images/og/og-default.webp",
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
    images: ["/images/og/og-default.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/icon.svg", type: "image/svg+xml" },
      { url: "/favicon/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
      { url: "/favicon/icon-152x152.png", sizes: "152x152" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon/icon.svg", color: "#efefef" },
    ],
  },
  manifest: "/favicon/manifest.webmanifest",
  other: {
    // Microsoft Tile
    "msapplication-TileColor": "#efefef",
    "msapplication-TileImage": "/favicon/icon-192x192.png",
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
    generateLocalBusinessSchema(),
  ];

  return (
    <html suppressHydrationWarning lang="es" className="no-touch">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebaseinstallations.googleapis.com" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        <script dangerouslySetInnerHTML={{ __html: setColorSchemeScript }} />
        <JsonLd data={structuredData} />
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning>
        <FirebaseInit />
        <PWARegister />
        <ImagePreloadManager />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
