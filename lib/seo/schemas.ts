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
