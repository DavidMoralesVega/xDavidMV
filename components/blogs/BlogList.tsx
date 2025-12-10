import socials from "@/data/socials.json";
import BlogListClient from "./BlogListClient";
import {
  getBlogPostsForList,
  getRecentPosts,
  getCategoriesWithCount,
  getTagsWithCount,
} from "@/lib/blog";

// -------------------- Component --------------------
export default function BlogList() {
  // Get all data at build time (Server Component)
  const allPosts = getBlogPostsForList();
  const recentPosts = getRecentPosts(3);
  const categoriesWithCount = getCategoriesWithCount().slice(0, 8);
  const tagsWithCount = getTagsWithCount().slice(0, 14);

  return (
    <BlogListClient
      allPosts={allPosts}
      categoriesWithCount={categoriesWithCount}
      tagsWithCount={tagsWithCount}
      recentPosts={recentPosts}
      socials={socials}
    />
  );
}
