import Awards from "@/components/common/Awards";
import Conferences from "@/components/common/Conferences";
import Cta from "@/components/common/Cta";
import Education from "@/components/common/Education";
import Footer2 from "@/components/footers/Footer2";

import About from "@/components/homes/home-freelancer-portfolio/About";
import Experiences from "@/components/homes/home-freelancer-portfolio/Experiences";
import Services from "@/components/other-pages/services/Services";
import Hero from "@/components/homes/home-creative-developer/Hero";
import MarqueeSlider from "@/components/homes/home-freelancer-portfolio/MarqueeSlider";
import ParallaxDivider from "@/components/homes/home-freelancer-portfolio/ParallaxDivider";
import ParallaxDivider2 from "@/components/homes/home-freelancer-portfolio/ParallaxDivider2";
import TechStack from "@/components/homes/home-freelancer-portfolio/TechStack";

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
        <Hero />

        {/* 2. Filosofía y enfoque - Quién soy */}
        <About />

        {/* 11. Visual divider */}
        <ParallaxDivider2 />

        {/* 3. CONFERENCIAS - Credibilidad y autoridad (16+ eventos) */}
        <Conferences />

        {/* 4. Servicios/Expertise - Qué ofrezco */}
        <Services />

        {/* 5. Visual divider */}
        <ParallaxDivider />

        {/* 6. Experiencia profesional - Trayectoria */}
        <Experiences />

        {/* 7. Stack tecnológico - Herramientas */}
        <TechStack />

        {/* 8. Visual marquee */}
        <MarqueeSlider />

        {/* 9. Formación académica */}
        <Education />

        {/* 10. Premios y reconocimientos */}
        <Awards />

        {/* 12. Call to action final - Contacto */}
        <Cta />
      </main>
      <Footer2 text="davidmoralesvega" />
    </>
  );
}
