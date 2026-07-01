import PinnedShowcase, { ShowcaseItem } from "./PinnedShowcase";
import { conferences } from "@/data/conferences.json";

interface Conference {
  id: number;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export default function ConferencesShowcase() {
  const all = conferences as Conference[];
  const items: ShowcaseItem[] = all.slice(0, 5).map((c) => ({
    key: c.id,
    href: "/conferencias",
    cover: c.images[0],
    coverAlt: c.title,
    tags: c.tags,
    title: c.title,
    tagline: c.description,
  }));

  return (
    <PinnedShowcase
      headingLine1="Conferencias"
      headingLine2="y talleres"
      description={`+${all.length} conferencias, charlas y talleres en eventos tecnológicos de Bolivia: Angular, NestJS, IA, DevOps y arquitectura de software.`}
      buttonText="Ver conferencias"
      buttonHref="/conferencias"
      cueLabel="Ver galería"
      items={items}
    />
  );
}
