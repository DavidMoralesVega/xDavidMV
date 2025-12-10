import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import PortfolioMasonry from "@/components/portfolios/PortfolioMasonry";
import {
  generatePageMetadata,
  generateSpeakingEventsSchema,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Conferencias y Talleres",
  description:
    "Galería de conferencias, charlas y talleres impartidos en eventos tecnológicos de Bolivia y Latinoamérica. +16 presentaciones sobre Angular, NestJS, IA, DevOps y arquitectura de software.",
  path: "/conferencias",
  tags: ["Conferencias", "Talleres", "Angular", "NestJS", "DevOps", "IA", "Speaker", "Bolivia"],
});

export default function ConferenciasPage() {
  const structuredData = [
    generateSpeakingEventsSchema(),
    generateCollectionPageSchema(),
    generateBreadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Conferencias", path: "/conferencias" },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <main id="mxd-page-content" className="mxd-page-content">
        <PortfolioMasonry />
        <Cta />
      </main>
      <Footer2 text="davidmoralesvega" />
    </>
  );
}
