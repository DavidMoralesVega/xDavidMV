import PreviewPage from "./preview/page";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "David Morales Vega | Solutions Architect & Tech Lead",
  description:
    "Arquitecto de Soluciones y Technical Lead con 7+ años de experiencia en diseño de ecosistemas digitales escalables. Especializado en Angular, NestJS, Microservicios y liderazgo de equipos. Oruro, Bolivia.",
  path: "/",
  type: "profile",
});

export default function Home() {
  return (
    <>
      <PreviewPage />
    </>
  );
}
