import BlogEducacionPermanente from "@/components/blogs/BlogEducacionPermanente";
import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all blog articles
export async function generateStaticParams() {
  return [
    {
      slug: "bolivia-ante-el-reto-de-la-educacion-permanente",
    },
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "bolivia-ante-el-reto-de-la-educacion-permanente") {
    return {
      title: "Bolivia ante el reto de la educación permanente | David Morales Vega",
      description:
        "Artículo publicado en la Revista Educativa Renacer sobre la necesidad de transición hacia un modelo de aprendizaje continuo en Bolivia frente a la automatización laboral.",
    };
  }

  return {
    title: "Artículo | David Morales Vega",
    description: "Publicaciones y artículos de David Morales Vega",
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // Validar el slug y mostrar el componente correspondiente
  if (slug === "bolivia-ante-el-reto-de-la-educacion-permanente") {
    return (
      <>
        <main id="mxd-page-content" className="mxd-page-content">
          <BlogEducacionPermanente />
          <Cta />
        </main>
        <Footer2 text="davidmoralesvega" />
      </>
    );
  }

  // Si el slug no coincide, mostrar 404
  notFound();
}
