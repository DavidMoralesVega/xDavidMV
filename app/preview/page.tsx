import BlogSection from "@/components/sections/BlogSection";
import ConferencesSection from "@/components/sections/ConferencesSection";
import CtaSection from "@/components/sections/CtaSection";
import EducationSection from "@/components/sections/EducationSection";
import Footer from "@/components/footers/Footer";

import AboutSection from "@/components/sections/AboutSection";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import ServicesSection from "@/components/pages/services/Services";
import HeroSection from "@/components/sections/hero/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import ParallaxImageDivider from "@/components/sections/dividers/ParallaxImageDivider";
import ParallaxVideoDivider from "@/components/sections/dividers/ParallaxVideoDivider";
import TechStackSection from "@/components/sections/TechStackSection";

import { Metadata } from "next";

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
