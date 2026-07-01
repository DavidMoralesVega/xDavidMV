import PinnedShowcase, { ShowcaseItem } from "./PinnedShowcase";
import { projects } from "@/data/projects.json";
import type { Project } from "@/components/portfolios/ProjectsMasonry";

export default function ProjectsShowcase() {
  const all = projects as Project[];
  const items: ShowcaseItem[] = all
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p) => ({
      key: p.id,
      href: `/proyectos/${p.slug}`,
      cover: p.cover,
      coverAlt: p.coverAlt,
      tags: p.tags,
      title: p.title,
      tagline: p.tagline,
    }));

  return (
    <PinnedShowcase
      headingLine1="Proyectos"
      headingLine2="destacados"
      description={`${all.length} productos en producción — plataformas institucionales, ERP/POS, PWA gubernamentales, LMS y un SaaS multi-tenant para clientes reales de Bolivia.`}
      buttonText="Ver todos los proyectos"
      buttonHref="/proyectos"
      cueLabel="Ver caso"
      items={items}
    />
  );
}
