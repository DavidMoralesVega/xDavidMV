import BlogArticle from "@/components/blogs/BlogArticle";
import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generatePageMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from "@/lib/seo";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all blog articles
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (post) {
    return generatePageMetadata({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      path: `/blog/${slug}`,
      image: post.frontmatter.image,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    });
  }

  return generatePageMetadata({
    title: "Artículo",
    description: "Publicaciones y artículos de David Morales Vega",
    path: `/blog/${slug}`,
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = generateArticleSchema({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${slug}`,
    image: post.frontmatter.image,
    publishedTime: post.frontmatter.date,
    tags: post.frontmatter.tags,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.frontmatter.title, path: `/blog/${slug}` },
  ]);

  // Person schema for author
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: siteConfig.author.jobTitle,
  };

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, authorSchema]} />
      <main id="mxd-page-content" className="mxd-page-content">
        <BlogArticle post={post} />
        <Cta />
      </main>
      <Footer2 text="David Morales Vega" />
    </>
  );
}
