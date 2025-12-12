// SEO Module - Re-exports
export { siteConfig } from "./config";
export { generatePageMetadata } from "./metadata";
export {
  generatePersonSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateProfilePageSchema,
  generateProfessionalServiceSchema,
  generateFAQSchema,
  generateEventSchema,
  generateSpeakingEventsSchema,
  generateCollectionPageSchema,
} from "./schemas";
export {
  staticRoutes,
  getBlogArticles,
  blogArticles,
  getBlogRoutes,
  getAllRoutes,
  type RouteConfig,
} from "./routes";
export { JsonLd } from "./JsonLd";
