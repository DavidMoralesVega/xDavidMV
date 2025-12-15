import dynamic from "next/dynamic";
import Footer from "@/components/footers/Footer";
import HeroSection from "@/components/sections/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import { Metadata } from "next";

// Lazy load below-the-fold sections to reduce initial JS bundle
const ParallaxVideoDivider = dynamic(
  () => import("@/components/sections/dividers/ParallaxVideoDivider"),
  { ssr: true }
);
const ConferencesSection = dynamic(
  () => import("@/components/sections/ConferencesSection"),
  { ssr: true }
);
const ServicesSection = dynamic(
  () => import("@/components/pages/services/Services"),
  { ssr: true }
);
const ParallaxImageDivider = dynamic(
  () => import("@/components/sections/dividers/ParallaxImageDivider"),
  { ssr: true }
);
const ExperiencesSection = dynamic(
  () => import("@/components/sections/ExperiencesSection"),
  { ssr: true }
);
const TechStackSection = dynamic(
  () => import("@/components/sections/TechStackSection"),
  { ssr: true }
);
const MarqueeSection = dynamic(
  () => import("@/components/sections/MarqueeSection"),
  { ssr: true }
);
const EducationSection = dynamic(
  () => import("@/components/sections/EducationSection"),
  { ssr: true }
);
const BlogSection = dynamic(
  () => import("@/components/sections/BlogSection"),
  { ssr: true }
);
const CtaSection = dynamic(
  () => import("@/components/sections/CtaSection"),
  { ssr: true }
);

export const metadata: Metadata = {
  title: "David Morales Vega | Solutions Architect & Tech Lead",
  description:
    "Arquitecto de Soluciones y Technical Lead con 7+ años de experiencia en diseño de ecosistemas digitales escalables. Especializado en Angular, NestJS, Microservicios y liderazgo de equipos de alto rendimiento.",
};

export default function PreviewPage() {
  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content">
        {/* 1. Presentación - Hero impactante */}
        <HeroSection />

        {/* 2. Filosofía y enfoque - Quién soy */}
        <AboutSection />

        {/* 3. Visual divider - Video */}
        <ParallaxVideoDivider />

        {/* 3. CONFERENCIAS - Credibilidad y autoridad (16+ eventos) */}
        <ConferencesSection />

        {/* 4. Servicios/Expertise - Qué ofrezco */}
        <ServicesSection />

        {/* 5. Visual divider - Image */}
        <ParallaxImageDivider />

        {/* 6. Experiencia profesional - Trayectoria */}
        <ExperiencesSection />

        {/* 7. Stack tecnológico - Herramientas */}
        <TechStackSection />

        {/* 8. Visual marquee */}
        <MarqueeSection />

        {/* 9. Formación académica */}
        <EducationSection />

        {/* 10. Blog - Publicaciones y artículos */}
        <BlogSection
          title="Publicaciones recientes"
          desc="Artículos sobre educación, tecnología e innovación. Contribuyendo al conocimiento de la comunidad tecnológica boliviana."
        />

        {/* 11. Call to action final - Contacto */}
        <CtaSection />
      </main>
      <Footer text="David Morales Vega" />
    </>
  );
}
