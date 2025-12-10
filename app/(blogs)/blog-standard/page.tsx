import { Suspense } from "react";
import BlogList from "@/components/blogs/BlogList";
import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import { generatePageMetadata } from "@/lib/seo";

// ============================================
// Metadata
// ============================================

export const metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Artículos sobre arquitectura de software, desarrollo web, metodologías ágiles y reflexiones sobre la industria tech. Contenido práctico desde la experiencia real.",
  path: "/blog-standard",
  tags: [
    "Blog",
    "Tecnología",
    "Desarrollo Web",
    "Arquitectura de Software",
    "Bolivia",
  ],
});

// ============================================
// Loading Fallback
// ============================================

function BlogListSkeleton() {
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container grid-container">
        <div className="mxd-posts-area">
          <div className="mxd-posts-container mxd-grid-item">
            <div className="blog-skeleton blog-skeleton--featured" />
            <div className="blog-skeleton blog-skeleton--card" />
            <div className="blog-skeleton blog-skeleton--card" />
            <div className="blog-skeleton blog-skeleton--card" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Page Component
// ============================================

export default function BlogStandardPage() {
  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content">
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
        <Cta />
      </main>
      <Footer2 />
    </>
  );
}
