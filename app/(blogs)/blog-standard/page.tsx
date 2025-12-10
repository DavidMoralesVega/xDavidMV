import Blogs1 from "@/components/blogs/Blogs1";
import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog | David Morales Vega - Publicaciones sobre Tecnología y Educación",
  description:
    "Artículos sobre educación, tecnología e innovación. Contribuyendo al conocimiento de la comunidad tecnológica boliviana.",
};
export default function BlogStandardPage() {
  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content">
        <Blogs1 />
        <Cta />
      </main>
      <Footer2 />
    </>
  );
}
