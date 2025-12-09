import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";

import PortfolioMasonry from "@/components/portfolios/PortfolioMasonry";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conferencias y Talleres | David Morales Vega",
  description:
    "Galería de conferencias, charlas y talleres impartidos en eventos tecnológicos de Bolivia y Latinoamérica. +16 presentaciones sobre Angular, NestJS, IA, DevOps y arquitectura de software.",
};

export default function ConferenciasPage() {
  return (
    <>
      <main
        id="mxd-page-content"
        className="mxd-page-content inner-page-content"
      >
        <PortfolioMasonry />
        <Cta />
      </main>
      <Footer2 text="davidmoralesvega" />
    </>
  );
}
