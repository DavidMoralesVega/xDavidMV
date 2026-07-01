import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/footers/Footer";
import ProjectsMasonry from "@/components/portfolios/ProjectsMasonry";
import {
  generatePageMetadata,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Proyectos",
  description:
    "Portafolio de productos y sistemas en producción: plataformas institucionales, ERP/POS, PWA gubernamentales, LMS y SaaS. Arquitectura de software, full stack y liderazgo técnico por David Morales Vega.",
  path: "/proyectos",
  image: "/images/og/og-default.webp",
  tags: [
    "Proyectos",
    "Portafolio",
    "Arquitectura de Software",
    "Full Stack",
    "Angular",
    "Next.js",
    "GraphQL",
    "Firebase",
    "PWA",
    "Bolivia",
  ],
});

export default function ProyectosPage() {
  const structuredData = [
    generateCollectionPageSchema(),
    generateBreadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Proyectos", path: "/proyectos" },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <main id="mxd-page-content" className="mxd-page-content">
        <ProjectsMasonry />
        <CtaSection />
      </main>
      <Footer text="David Morales Vega" />
    </>
  );
}
