import { Metadata } from "next";
import { notFound } from "next/navigation";

import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/footers/Footer";
import ProjectDetail from "@/components/portfolios/ProjectDetail";
import {
  generatePageMetadata,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from "@/lib/seo";
import { projects } from "@/data/projects.json";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return generatePageMetadata({
      title: "Proyecto",
      description: "Portafolio de proyectos de David Morales Vega",
      path: `/proyectos/${slug}`,
    });
  }

  return generatePageMetadata({
    title: project.title,
    description: project.summary,
    path: `/proyectos/${slug}`,
    image: project.cover,
    tags: [...project.tags, ...project.stack.slice(0, 4)],
  });
}

export default async function ProyectoPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.summary,
    url: `${siteConfig.url}/proyectos/${slug}`,
    image: `${siteConfig.url}${project.cover}`,
    dateCreated: project.year,
    inLanguage: "es",
    keywords: [...project.tags, ...project.stack].join(", "),
    creator: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Proyectos", path: "/proyectos" },
    { name: project.title, path: `/proyectos/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={[creativeWorkSchema, breadcrumbSchema]} />
      <main id="mxd-page-content" className="mxd-page-content">
        <ProjectDetail slug={slug} />
        <CtaSection />
      </main>
      <Footer text="David Morales Vega" />
    </>
  );
}
