import PreviewPage from "./preview/page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "David Morales Vega | Solutions Architect & Tech Lead",
  description:
    "Arquitecto de Soluciones y Technical Lead con 7+ años de experiencia en diseño de ecosistemas digitales escalables. Especializado en Angular, NestJS, Microservicios y liderazgo de equipos. Oruro, Bolivia.",
};
export default function Home() {
  return (
    <>
      <PreviewPage />
    </>
  );
}
