import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/MDXComponents";

// ============================================
// Types
// ============================================

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  categories?: string[];
  published?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: string;
  content: string;
}

export interface BlogPostWithMDX extends Omit<BlogPost, "content"> {
  content: React.ReactElement;
}

// ============================================
// Configuration
// ============================================

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const rehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
  defaultLang: "plaintext",
  onVisitLine(node: { children: unknown[] }) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: { properties: { className: string[] } }) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedChars(node: { properties: { className: string[] } }) {
    node.properties.className = ["word"];
  },
};

// ============================================
// Core Functions
// ============================================

/**
 * Get all blog post slugs for static generation
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get all blog posts metadata (without compiled MDX)
 */
export function getAllBlogPosts(): BlogPost[] {
  const slugs = getAllBlogSlugs();

  const posts = slugs
    .map((slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Skip unpublished posts in production
      if (data.published === false && process.env.NODE_ENV === "production") {
        return null;
      }

      const stats = readingTime(content);

      return {
        slug,
        frontmatter: data as BlogFrontmatter,
        readingTime: `${Math.ceil(stats.minutes)} min. de lectura`,
        content,
      };
    })
    .filter((post): post is BlogPost => post !== null);

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });
}

/**
 * Get a single blog post by slug with compiled MDX
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostWithMDX | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(fileContent);

  // Skip unpublished posts in production
  if (data.published === false && process.env.NODE_ENV === "production") {
    return null;
  }

  const stats = readingTime(rawContent);

  const { content } = await compileMDX({
    source: rawContent,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
      },
    },
  });

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    readingTime: `${Math.ceil(stats.minutes)} min. de lectura`,
    content,
  };
}

/**
 * Get blog posts for the blog list page (formatted for UI)
 */
export function getBlogPostsForList() {
  const posts = getAllBlogPosts();

  return posts.map((post) => ({
    id: post.slug,
    img: post.frontmatter.image,
    imgAlt: post.frontmatter.imageAlt || post.frontmatter.title,
    categories: post.frontmatter.categories || post.frontmatter.tags.slice(0, 3),
    meta: post.frontmatter.tags.slice(0, 3),
    date: formatDate(post.frontmatter.date),
    title: post.frontmatter.title,
    excerpt: post.frontmatter.description,
    slug: post.slug,
    readingTime: post.readingTime,
  }));
}

/**
 * Get featured post (most recent)
 */
export function getFeaturedPost() {
  const posts = getBlogPostsForList();
  return posts[0] || null;
}

/**
 * Get recent posts for sidebar
 */
export function getRecentPosts(limit: number = 3) {
  const posts = getBlogPostsForList();
  return posts.slice(0, limit);
}

// ============================================
// Helpers
// ============================================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const posts = getAllBlogPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get all unique categories from all posts
 */
export function getAllCategories(): string[] {
  const posts = getAllBlogPosts();
  const categoriesSet = new Set<string>();

  posts.forEach((post) => {
    const categories = post.frontmatter.categories || post.frontmatter.tags;
    categories.forEach((cat) => categoriesSet.add(cat));
  });

  return Array.from(categoriesSet).sort();
}

// ============================================
// Filtering & Pagination
// ============================================

export interface BlogFilterParams {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

const POSTS_PER_PAGE = 6;

/**
 * Normalize string for search comparison (removes accents, lowercase)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Get filtered and paginated blog posts
 */
export function getFilteredBlogPosts(params: BlogFilterParams = {}) {
  const { category, tag, search, page = 1 } = params;
  let posts = getAllBlogPosts();

  // Filter by category
  if (category) {
    const normalizedCategory = normalizeString(category);
    posts = posts.filter((post) => {
      const categories = post.frontmatter.categories || post.frontmatter.tags;
      return categories.some(
        (cat) => normalizeString(cat) === normalizedCategory
      );
    });
  }

  // Filter by tag
  if (tag) {
    const normalizedTag = normalizeString(tag);
    posts = posts.filter((post) =>
      post.frontmatter.tags.some((t) => normalizeString(t) === normalizedTag)
    );
  }

  // Filter by search query
  if (search && search.trim()) {
    const normalizedSearch = normalizeString(search.trim());
    posts = posts.filter((post) => {
      const titleMatch = normalizeString(post.frontmatter.title).includes(
        normalizedSearch
      );
      const descMatch = normalizeString(post.frontmatter.description).includes(
        normalizedSearch
      );
      const tagsMatch = post.frontmatter.tags.some((t) =>
        normalizeString(t).includes(normalizedSearch)
      );
      const contentMatch = normalizeString(post.content).includes(
        normalizedSearch
      );
      return titleMatch || descMatch || tagsMatch || contentMatch;
    });
  }

  // Calculate pagination
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalPosts);

  // Paginate posts
  const paginatedPosts = posts.slice(startIndex, endIndex);

  // Format posts for UI
  const formattedPosts = paginatedPosts.map((post) => ({
    id: post.slug,
    img: post.frontmatter.image,
    imgAlt: post.frontmatter.imageAlt || post.frontmatter.title,
    categories: post.frontmatter.categories || post.frontmatter.tags.slice(0, 3),
    meta: post.frontmatter.tags.slice(0, 3),
    date: formatDate(post.frontmatter.date),
    title: post.frontmatter.title,
    excerpt: post.frontmatter.description,
    slug: post.slug,
    readingTime: post.readingTime,
  }));

  const pagination: PaginationInfo = {
    currentPage,
    totalPages,
    totalPosts,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex,
    endIndex,
  };

  return {
    posts: formattedPosts,
    pagination,
    filters: {
      category: category || null,
      tag: tag || null,
      search: search || null,
    },
  };
}

/**
 * Get category with post count
 */
export function getCategoriesWithCount(): { name: string; count: number }[] {
  const posts = getAllBlogPosts();
  const categoryCount = new Map<string, number>();

  posts.forEach((post) => {
    const categories = post.frontmatter.categories || post.frontmatter.tags;
    categories.forEach((cat) => {
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
    });
  });

  return Array.from(categoryCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get tags with post count
 */
export function getTagsWithCount(): { name: string; count: number }[] {
  const posts = getAllBlogPosts();
  const tagCount = new Map<string, number>();

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Build URL with query params for blog filtering
 */
export function buildBlogUrl(params: BlogFilterParams): string {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set("category", params.category);
  }
  if (params.tag) {
    searchParams.set("tag", params.tag);
  }
  if (params.search) {
    searchParams.set("q", params.search);
  }
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const queryString = searchParams.toString();
  return `/blog-standard${queryString ? `?${queryString}` : ""}`;
}
