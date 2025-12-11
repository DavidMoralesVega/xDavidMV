import { Metadata } from "next";

// ============================================
// SEO Configuration - Centralized SEO Service
// ============================================

export const siteConfig = {
  name: "David Morales Vega",
  title: "David Morales Vega | Solutions Architect & Tech Lead",
  description:
    "Arquitecto de Soluciones y Technical Lead con 7+ años de experiencia en diseño de ecosistemas digitales escalables. Especializado en Angular, NestJS, Microservicios y liderazgo de equipos.",
  url: "https://www.moralesvegadavid.com",
  locale: "es_BO",
  language: "es",
  region: "BO",
  city: "Oruro",
  country: "Bolivia",
  countryCode: "BO",
  phone: "+591 61816001",
  author: {
    name: "David Morales Vega",
    email: "contacto@moralesvegadavid.com",
    jobTitle: "Solutions Architect & Tech Lead",
    image: "/img/brand/DavidMV.png",
    location: "Oruro, Bolivia",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/morales-vega-david/",
    github: "https://github.com/DavidMoralesVega",
    facebook: "https://www.facebook.com/moralesvegadavid/",
    instagram: "https://www.instagram.com/moralesvegadaviddante/",
    twitter: "@moralesvegadavid",
  },
  keywords: [
    "Solutions Architect",
    "Tech Lead",
    "Angular",
    "NestJS",
    "Microservicios",
    "Arquitectura de Software",
    "Desarrollo Web",
    "Bolivia",
    "Oruro",
    "David Morales Vega",
    "Technical Lead",
    "Full Stack Developer",
    "Conferencias tecnología",
    "Speaker Bolivia",
  ],
  // Para SEO de IAs/LLMs
  aiDescription:
    "David Morales Vega es un Arquitecto de Soluciones y Technical Lead boliviano con sede en Oruro. Tiene más de 7 años de experiencia en desarrollo de software, especializado en Angular, NestJS, microservicios, arquitectura hexagonal y liderazgo de equipos. Es conferencista activo con más de 16 presentaciones en eventos tecnológicos de Bolivia y Latinoamérica. Fundador de BeMoreX, agencia digital. Egresado de la Universidad Técnica de Oruro.",
};

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

  // Add article-specific metadata
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

// ============================================
// JSON-LD Structured Data Schemas
// ============================================

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    givenName: "David",
    familyName: "Morales Vega",
    jobTitle: siteConfig.author.jobTitle,
    description: siteConfig.aiDescription,
    url: siteConfig.url,
    email: siteConfig.author.email,
    telephone: siteConfig.phone,
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.author.image}`,
      width: 400,
      height: 400,
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
    ],
    knowsAbout: [
      "Software Architecture",
      "Angular",
      "NestJS",
      "Microservices",
      "Technical Leadership",
      "Full Stack Development",
      "Cloud Computing",
      "DevOps",
      "TypeScript",
      "Node.js",
      "React",
      "Next.js",
      "Flutter",
      "Domain-Driven Design",
      "Hexagonal Architecture",
      "CQRS",
      "Event-Driven Architecture",
    ],
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Spanish",
        alternateName: "es",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: {
        "@type": "Country",
        name: siteConfig.country,
        identifier: siteConfig.countryCode,
      },
    },
    nationality: {
      "@type": "Country",
      name: siteConfig.country,
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Técnica de Oruro",
        alternateName: "UTO",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Oruro",
          addressCountry: "Bolivia",
        },
      },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Solutions Architect",
      occupationLocation: {
        "@type": "Country",
        name: siteConfig.country,
      },
      skills: "Angular, NestJS, Microservices, TypeScript, Technical Leadership",
    },
    worksFor: {
      "@type": "Organization",
      name: "BeMoreX",
      url: "https://www.bemorex.com",
      logo: "https://www.bemorex.com/brand/logo-brand.png",
    },
    memberOf: [
      {
        "@type": "Organization",
        name: "BeMoreX Digital Agency",
        url: "https://www.bemorex.com",
      },
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
    inLanguage: siteConfig.language,
  };
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  path: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
}

export function generateArticleSchema({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  tags = [],
}: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.url}${path}/#article`,
    headline: title,
    description,
    image: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@id": `${siteConfig.url}/#person`,
    },
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${path}`,
    },
    keywords: tags.join(", "),
    inLanguage: siteConfig.language,
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
  };
}

// Schema para servicios profesionales
export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: `${siteConfig.author.name} - Servicios de Consultoría`,
    description:
      "Servicios de arquitectura de software, desarrollo web, consultoría tecnológica y conferencias especializadas.",
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.author.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -17.9647,
      longitude: -67.1064,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Bolivia",
      },
      {
        "@type": "Country",
        name: "Latinoamérica",
      },
    ],
    serviceType: [
      "Arquitectura de Software",
      "Desarrollo Web",
      "Consultoría Tecnológica",
      "Conferencias y Talleres",
      "Liderazgo Técnico",
    ],
    provider: {
      "@id": `${siteConfig.url}/#person`,
    },
    priceRange: "$$",
  };
}

// Schema FAQ para IAs - muy útil para que las IAs entiendan mejor el contenido
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Quién es David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "David Morales Vega es un Arquitecto de Soluciones y Technical Lead boliviano con más de 7 años de experiencia en desarrollo de software. Se especializa en Angular, NestJS, microservicios y liderazgo de equipos técnicos. Es fundador de BeMoreX y conferencista activo con más de 16 presentaciones en eventos tecnológicos.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué servicios ofrece David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrece servicios de arquitectura de software, desarrollo web full-stack, consultoría tecnológica, conferencias y talleres especializados, y liderazgo técnico para equipos de desarrollo.",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué tecnologías se especializa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Se especializa en Angular, NestJS, TypeScript, Node.js, microservicios, arquitectura hexagonal, DDD (Domain-Driven Design), React, Next.js, Flutter, Docker, y metodologías ágiles como Scrum.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde está ubicado David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Está ubicado en Oruro, Bolivia. Ofrece servicios tanto presenciales en Bolivia como remotos para clientes en toda Latinoamérica.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo puedo contactar a David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Puedes contactarlo a través de su sitio web ${siteConfig.url}/contacto, por email a ${siteConfig.author.email}, o por teléfono al ${siteConfig.phone}.`,
        },
      },
    ],
  };
}

// Schema para eventos/conferencias individuales
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: "Bolivia",
      },
    },
    image: event.image,
    organizer: {
      "@id": `${siteConfig.url}/#person`,
    },
    performer: {
      "@id": `${siteConfig.url}/#person`,
    },
  };
}

// Schema para colección de conferencias/charlas (ItemList)
export function generateSpeakingEventsSchema() {
  // Lista de conferencias destacadas para el schema
  const speakingEvents = [
    {
      name: "El Viaje del Arquitecto: Sistemas Empresariales",
      description: "Conferencia sobre arquitectura de software y migración de sistemas ERP",
      date: "2025-11",
      location: "CCBOL, Bolivia",
      type: "Speaker",
    },
    {
      name: "Decisiones Inteligentes: App de IA con Python y OpenAI",
      description: "Workshop práctico de desarrollo de aplicaciones con IA usando Python, FastAPI y OpenAI",
      date: "2025-11",
      location: "CCBOL, Bolivia",
      type: "Workshop Instructor",
    },
    {
      name: "NgWorkshop Oruro - Angular Bolivia 2024",
      description: "Evento oficial de Angular Bolivia como organizador y director técnico",
      date: "2024-05",
      location: "Oruro, Bolivia",
      type: "Organizer & Technical Director",
    },
    {
      name: "Chatbots con Python: ChatGPT + WhatsApp Business",
      description: "Workshop de integración de ChatGPT API con WhatsApp Business en PyDay La Paz",
      date: "2023-06",
      location: "UMSA, La Paz, Bolivia",
      type: "Speaker & Workshop",
    },
    {
      name: "Bootcamp FullStack: NestJS + Angular",
      description: "Curso intensivo de desarrollo fullstack con NestJS, Angular y PostgreSQL",
      date: "2022-11",
      location: "UTO FNI, Oruro, Bolivia",
      type: "Lead Instructor",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Conferencias y Talleres de David Morales Vega",
    description:
      "Colección de más de 16 conferencias, workshops y charlas técnicas impartidas en eventos de tecnología en Bolivia y Latinoamérica.",
    numberOfItems: 16,
    itemListElement: speakingEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.name,
        description: event.description,
        startDate: event.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressCountry: "Bolivia",
          },
        },
        performer: {
          "@type": "Person",
          name: siteConfig.author.name,
          jobTitle: event.type,
        },
        organizer: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    })),
  };
}

// Schema para página de colección/galería
export function generateCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Conferencias y Talleres | David Morales Vega",
    description:
      "Galería de conferencias, charlas y talleres impartidos en eventos tecnológicos de Bolivia y Latinoamérica. +16 presentaciones sobre Angular, NestJS, IA, DevOps y arquitectura de software.",
    url: `${siteConfig.url}/conferencias`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 16,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    },
    author: {
      "@id": `${siteConfig.url}/#person`,
    },
    about: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
    },
  };
}

// ============================================
// JSON-LD Component Helper
// ============================================

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? data : data),
      }}
    />
  );
}

// ============================================
// Route Configuration for Sitemap
// ============================================

export interface RouteConfig {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  lastModified?: Date;
}

export const staticRoutes: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/conferencias", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.8 },
];

// Blog articles - dynamically generated from MDX files
// Import getAllBlogPosts lazily to avoid circular dependencies
export function getBlogArticles() {
  // Dynamic import to read MDX files at build time
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");

  const BLOG_DIR = path.join(process.cwd(), "content", "blog");

  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const articles = files
    .filter((file: string) => file.endsWith(".mdx"))
    .map((file: string) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        image: data.image,
        publishedTime: data.date,
        tags: data.tags || [],
      };
    })
    .sort((a: { publishedTime: string }, b: { publishedTime: string }) => {
      return new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime();
    });

  return articles;
}

// For backwards compatibility
export const blogArticles = getBlogArticles();

export function getBlogRoutes(): RouteConfig[] {
  const articles = getBlogArticles();
  return articles.map((article: { slug: string; publishedTime: string }) => ({
    path: `/blog/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(article.publishedTime),
  }));
}

export function getAllRoutes(): RouteConfig[] {
  return [...staticRoutes, ...getBlogRoutes()];
}
