import { siteConfig } from "./config";

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
      { "@type": "Language", name: "Spanish", alternateName: "es" },
      { "@type": "Language", name: "English", alternateName: "en" },
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
    nationality: { "@type": "Country", name: siteConfig.country },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Técnica de Oruro",
        alternateName: "UTO",
        description: "Licenciatura en Derecho - Abogado",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Oruro",
          addressCountry: "Bolivia",
        },
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Adventista de Bolivia",
        alternateName: "UAB",
        description: "Ingeniería de Sistemas",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cochabamba",
          addressCountry: "Bolivia",
        },
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Mayor de San Andrés",
        alternateName: "UMSA",
        description: "Maestría en Transformación Digital y Gestión de Proyectos Tecnológicos (en curso)",
        address: {
          "@type": "PostalAddress",
          addressLocality: "La Paz",
          addressCountry: "Bolivia",
        },
      },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Solutions Architect",
      occupationLocation: { "@type": "Country", name: siteConfig.country },
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
    publisher: { "@id": `${siteConfig.url}/#person` },
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
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#person` },
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
    mainEntity: { "@id": `${siteConfig.url}/#person` },
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
  };
}

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
    geo: { "@type": "GeoCoordinates", latitude: -17.9647, longitude: -67.1064 },
    areaServed: [
      { "@type": "Country", name: "Bolivia" },
      { "@type": "Country", name: "Latinoamérica" },
    ],
    serviceType: [
      "Arquitectura de Software",
      "Desarrollo Web",
      "Consultoría Tecnológica",
      "Conferencias y Talleres",
      "Liderazgo Técnico",
    ],
    provider: { "@id": `${siteConfig.url}/#person` },
    priceRange: "$$",
  };
}

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
          text: "David Morales Vega es un Arquitecto de Soluciones y Technical Lead boliviano con más de 7 años de experiencia en desarrollo de software. Posee un perfil único: es Ingeniero de Sistemas y Abogado, lo que lo posiciona como experto en Legal-Tech en Bolivia. Se especializa en Angular, NestJS, microservicios y liderazgo de equipos técnicos. Es fundador de BeMoreX y conferencista activo con más de 16 presentaciones en eventos tecnológicos.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué servicios ofrece David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrece servicios de arquitectura de software, desarrollo web full-stack, consultoría tecnológica, conferencias y talleres especializados, liderazgo técnico para equipos de desarrollo, y consultoría Legal-Tech (intersección entre derecho y tecnología).",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué tecnologías se especializa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Se especializa en Angular, NestJS, TypeScript, Node.js, microservicios, arquitectura hexagonal, DDD (Domain-Driven Design), React, Next.js, Flutter, Python, Docker, y metodologías ágiles como Scrum.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde está ubicado David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Está ubicado en Oruro, Bolivia. Ofrece servicios tanto presenciales en Bolivia como remotos para clientes en toda Latinoamérica y el mundo.",
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
      {
        "@type": "Question",
        name: "¿Qué es Legal-Tech y cómo puede ayudar David Morales Vega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Legal-Tech es la aplicación de tecnología a servicios jurídicos. David Morales Vega, con títulos en Ingeniería de Sistemas y Derecho, ofrece consultoría única en automatización de procesos legales, desarrollo de software para despachos de abogados, cumplimiento normativo digital y contratos inteligentes.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta contratar un desarrollador en Oruro, Bolivia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los salarios de desarrolladores en Oruro varían según experiencia: Junior ($400-800/mes), Semi-senior ($800-1,500/mes), Senior ($1,500-2,500/mes), Lead/Arquitecto ($2,000-4,000/mes). Los costos son 20-30% menores que en La Paz o Cochabamba.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo está la industria del software en Bolivia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bolivia tiene 152 startups activas, más de 1,149 empresas de software, y exporta aproximadamente $57 millones anuales en servicios de software. Cochabamba es el principal hub, produciendo el 80% del software de exportación. El mercado está en crecimiento con proyección a $225 millones para 2029.",
        },
      },
      {
        "@type": "Question",
        name: "¿David Morales Vega ofrece capacitaciones y conferencias?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, David Morales Vega es conferencista activo con más de 16 presentaciones en eventos tecnológicos de Bolivia y Latinoamérica. Ofrece bootcamps, workshops y talleres sobre Angular, NestJS, Python, IA, arquitectura de software y desarrollo web.",
        },
      },
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: "David Morales Vega - Consultoría en Tecnología y Legal-Tech",
    alternateName: "BeMoreX Digital Agency",
    description:
      "Servicios de arquitectura de software, desarrollo web, consultoría tecnológica y Legal-Tech en Oruro, Bolivia. Especializado en Angular, NestJS, microservicios y transformación digital para empresas.",
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.author.email,
    image: `${siteConfig.url}${siteConfig.author.image}`,
    logo: `${siteConfig.url}${siteConfig.author.image}`,
    priceRange: "$$",
    currenciesAccepted: "BOB, USD",
    paymentAccepted: "Transferencia bancaria, PayPal, Efectivo",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Oruro",
      addressLocality: "Oruro",
      addressRegion: "Oruro",
      postalCode: "0000",
      addressCountry: {
        "@type": "Country",
        name: "Bolivia",
        identifier: "BO",
      },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -17.9647,
      longitude: -67.1064,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Oruro",
        containedIn: {
          "@type": "Country",
          name: "Bolivia",
        },
      },
      {
        "@type": "City",
        name: "La Paz",
        containedIn: {
          "@type": "Country",
          name: "Bolivia",
        },
      },
      {
        "@type": "City",
        name: "Cochabamba",
        containedIn: {
          "@type": "Country",
          name: "Bolivia",
        },
      },
      {
        "@type": "City",
        name: "Santa Cruz",
        containedIn: {
          "@type": "Country",
          name: "Bolivia",
        },
      },
      {
        "@type": "Country",
        name: "Bolivia",
      },
      {
        "@type": "Continent",
        name: "América Latina",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Consultoría Tecnológica",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Arquitectura de Software",
            description:
              "Diseño de ecosistemas digitales escalables con microservicios, arquitectura hexagonal, DDD y CQRS.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Desarrollo Frontend y Mobile",
            description:
              "Desarrollo de aplicaciones web y móviles con Angular, Next.js, Flutter y PWA.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Desarrollo Backend y APIs",
            description:
              "Desarrollo de APIs y servicios backend con NestJS, Node.js, Spring Boot y GraphQL.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Consultoría Legal-Tech",
            description:
              "Automatización de procesos legales, software para despachos de abogados, cumplimiento normativo digital.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Conferencias y Capacitaciones",
            description:
              "Bootcamps, workshops y conferencias sobre desarrollo de software, arquitectura y tecnología.",
          },
        },
      ],
    },
    founder: {
      "@id": `${siteConfig.url}/#person`,
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      "https://www.bemorex.com",
    ],
    knowsAbout: [
      "Desarrollo de Software",
      "Arquitectura de Software",
      "Angular",
      "NestJS",
      "Microservicios",
      "Legal-Tech",
      "Transformación Digital",
      "Consultoría Tecnológica",
    ],
    knowsLanguage: ["Spanish", "English"],
  };
}

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
      address: { "@type": "PostalAddress", addressCountry: "Bolivia" },
    },
    image: event.image,
    organizer: { "@id": `${siteConfig.url}/#person` },
    performer: { "@id": `${siteConfig.url}/#person` },
  };
}

export function generateSpeakingEventsSchema() {
  // Import conferences data dynamically to avoid circular dependencies
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { conferences } = require("@/data/conferences.json");

  // Map date strings to ISO format (approximate)
  const dateMap: Record<string, string> = {
    "Noviembre 2025": "2025-11",
    "Septiembre 2025": "2025-09",
    "Mayo - Junio 2025": "2025-05",
    "Mayo 2024": "2024-05",
    "Marzo 2024": "2024-03",
    "Junio 2023": "2023-06",
    "Febrero 2023": "2023-02",
    "Nov - Dic 2022": "2022-11",
    "Sep - Oct 2021": "2021-09",
    "Abril - Mayo 2021": "2021-04",
    "Diciembre 2019": "2019-12",
    "Agosto 2019": "2019-08",
    "Junio - Julio 2019": "2019-06",
    "Junio - Agosto 2019": "2019-06",
  };

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Conferencias y Talleres de David Morales Vega",
    description: `Colección de ${conferences.length} conferencias, workshops y charlas técnicas impartidas en eventos de tecnología en Bolivia y Latinoamérica desde 2019.`,
    numberOfItems: conferences.length,
    itemListElement: conferences.map((event: { title: string; description: string; date: string; institution: string; type: string; tags: string[] }, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: `${event.title} ${event.description}`,
        description: `${event.type} - ${event.tags.join(", ")}`,
        startDate: dateMap[event.date] || "2019-01",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: `${event.institution}, Bolivia`,
          address: { "@type": "PostalAddress", addressCountry: "Bolivia" },
        },
        performer: {
          "@type": "Person",
          name: siteConfig.author.name,
          jobTitle: event.type,
        },
        organizer: { "@id": `${siteConfig.url}/#person` },
      },
    })),
  };
}

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
    author: { "@id": `${siteConfig.url}/#person` },
    about: { "@type": "Person", "@id": `${siteConfig.url}/#person` },
  };
}

export function generateBlogPostingSchema({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  tags = [],
  readingTime,
}: ArticleSchemaProps & { readingTime?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}${path}/#blogposting`,
    headline: title,
    description,
    image: {
      "@type": "ImageObject",
      url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
      width: 1200,
      height: 630,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.author.image}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${path}`,
    },
    keywords: tags.join(", "),
    articleSection: tags[0] || "Technology",
    wordCount: readingTime ? parseInt(readingTime) * 200 : undefined, // Estimación: 200 palabras/minuto
    inLanguage: siteConfig.language,
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog/#blog`,
      name: `Blog de ${siteConfig.author.name}`,
    },
  };
}

export function generateVideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnailUrl.startsWith("http")
      ? thumbnailUrl
      : `${siteConfig.url}${thumbnailUrl}`,
    uploadDate,
    contentUrl,
    embedUrl,
    duration, // Format: PT1M30S (1 minuto 30 segundos)
    publisher: { "@id": `${siteConfig.url}/#person` },
    creator: { "@id": `${siteConfig.url}/#person` },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.author.image}`,
    },
    founder: { "@id": `${siteConfig.url}/#person` },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.author.email,
      telephone: siteConfig.phone,
      contactType: "Customer Service",
      availableLanguage: ["Spanish", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
    ],
  };
}

export function generateHowToSchema({
  name,
  description,
  steps,
  totalTime,
  image,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    image: image ? `${siteConfig.url}${image}` : undefined,
    totalTime, // Format: PT30M (30 minutos)
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? `${siteConfig.url}${step.image}` : undefined,
    })),
    author: { "@id": `${siteConfig.url}/#person` },
  };
}
