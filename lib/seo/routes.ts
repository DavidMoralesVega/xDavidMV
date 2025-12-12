// ============================================
// Route Configuration for Sitemap
// ============================================

export interface RouteConfig {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  lastModified?: Date;
}

export const staticRoutes: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/conferencias", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.8 },
];

export function getBlogArticles() {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");

  const BLOG_DIR = path.join(process.cwd(), "content", "blog");

  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const articles = files
    .filter((file: string) => file.endsWith(".mdx"))
    .map((file: string) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        image: data.image,
        publishedTime: data.date,
        tags: data.tags || [],
      };
    })
    .sort((a: { publishedTime: string }, b: { publishedTime: string }) => {
      return new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime();
    });

  return articles;
}

export const blogArticles = getBlogArticles();

export function getBlogRoutes(): RouteConfig[] {
  const articles = getBlogArticles();
  return articles.map((article: { slug: string; publishedTime: string }) => ({
    path: `/blog/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(article.publishedTime),
  }));
}

export function getAllRoutes(): RouteConfig[] {
  return [...staticRoutes, ...getBlogRoutes()];
}
