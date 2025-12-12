import { describe, it, expect, beforeAll } from 'vitest';
import {
  getAllBlogSlugs,
  getAllBlogPosts,
  getBlogPostBySlug,
  getFilteredBlogPosts,
  getFeaturedPost,
  getRecentPosts,
  getAllTags,
} from '@/lib/blog';

describe('Blog System', () => {
  describe('getAllBlogSlugs', () => {
    it('should return an array of slugs', () => {
      const slugs = getAllBlogSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
    });

    it('should return valid slug formats', () => {
      const slugs = getAllBlogSlugs();
      slugs.forEach((slug) => {
        expect(typeof slug).toBe('string');
        expect(slug).toMatch(/^[a-z0-9-]+$/); // slugs should be kebab-case
      });
    });
  });

  describe('getAllBlogPosts', () => {
    it('should return an array of blog posts', () => {
      const posts = getAllBlogPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it('should have required frontmatter fields', () => {
      const posts = getAllBlogPosts();
      posts.forEach((post) => {
        expect(post).toHaveProperty('slug');
        expect(post).toHaveProperty('frontmatter');
        expect(post.frontmatter).toHaveProperty('title');
        expect(post.frontmatter).toHaveProperty('description');
        expect(post.frontmatter).toHaveProperty('date');
        expect(post.frontmatter).toHaveProperty('tags');
        expect(post.frontmatter).toHaveProperty('image');
      });
    });

    it('should sort posts by date descending', () => {
      const posts = getAllBlogPosts();
      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].frontmatter.date);
        const nextDate = new Date(posts[i + 1].frontmatter.date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('should only return published posts', () => {
      const posts = getAllBlogPosts();
      posts.forEach((post) => {
        expect(post.frontmatter.published).not.toBe(false);
      });
    });
  });

  describe('getBlogPostBySlug', () => {
    it('should return a specific blog post', async () => {
      const posts = getAllBlogPosts();
      if (posts.length === 0) return;

      const slug = posts[0].slug;
      const post = await getBlogPostBySlug(slug);

      expect(post).toBeDefined();
      expect(post).not.toBeNull();
      if (!post) return;

      expect(post.slug).toBe(slug);
      expect(post).toHaveProperty('frontmatter');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('readingTime');
    });

    it('should include reading time', async () => {
      const posts = getAllBlogPosts();
      if (posts.length === 0) return;

      const post = await getBlogPostBySlug(posts[0].slug);
      expect(post).not.toBeNull();
      if (!post) return;

      // Acepta tanto "min de lectura" como "min. de lectura"
      expect(post.readingTime).toMatch(/\d+ min\.? de lectura/);
    });

    it('should return null for invalid slug', async () => {
      const result = await getBlogPostBySlug('non-existent-slug');
      expect(result).toBeNull();
    });
  });

  describe('getFilteredBlogPosts', () => {
    it('should filter by tag', () => {
      const allPosts = getAllBlogPosts();
      if (allPosts.length === 0) return;

      const firstTag = allPosts[0].frontmatter.tags[0];
      const result = getFilteredBlogPosts({ tag: firstTag });

      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('pagination');
      expect(result).toHaveProperty('filters');
      expect(Array.isArray(result.posts)).toBe(true);
      expect(result.posts.length).toBeGreaterThan(0);
      result.posts.forEach((post) => {
        expect(post.meta).toContain(firstTag);
      });
    });

    it('should filter by search query', () => {
      const result = getFilteredBlogPosts({ search: 'angular' });

      expect(result).toHaveProperty('posts');
      expect(Array.isArray(result.posts)).toBe(true);
      result.posts.forEach((post) => {
        const searchableContent = `${post.title} ${post.excerpt}`.toLowerCase();
        expect(searchableContent).toContain('angular');
      });
    });

    it('should handle pagination', () => {
      const allPosts = getAllBlogPosts();
      const result1 = getFilteredBlogPosts({ page: 1 });

      expect(result1).toHaveProperty('posts');
      expect(result1).toHaveProperty('pagination');
      expect(Array.isArray(result1.posts)).toBe(true);
      expect(result1.posts.length).toBeLessThanOrEqual(6); // POSTS_PER_PAGE = 6

      // Pagination info should be correct
      expect(result1.pagination.currentPage).toBe(1);
      expect(result1.pagination.totalPosts).toBe(allPosts.length);
      expect(result1.pagination.totalPages).toBe(Math.ceil(allPosts.length / 6));

      // If there are enough posts for a second page, test it
      if (allPosts.length > 6) {
        const result2 = getFilteredBlogPosts({ page: 2 });
        expect(Array.isArray(result2.posts)).toBe(true);
        expect(result2.posts.length).toBeLessThanOrEqual(6);
        expect(result2.pagination.currentPage).toBe(2);
        expect(result1.pagination.hasNextPage).toBe(true);

        // Pages should not overlap
        if (result1.posts.length > 0 && result2.posts.length > 0) {
          expect(result1.posts[0].slug).not.toBe(result2.posts[0].slug);
        }
      } else {
        // Not enough posts for pagination
        expect(result1.pagination.hasNextPage).toBe(false);
        expect(result1.pagination.totalPages).toBe(1);
      }
    });
  });

  describe('getFeaturedPost', () => {
    it('should return the most recent post', () => {
      const featured = getFeaturedPost();
      const allPosts = getAllBlogPosts();

      if (allPosts.length === 0) return;

      expect(featured).toBeDefined();
      expect(featured?.slug).toBe(allPosts[0].slug);
    });
  });

  describe('getRecentPosts', () => {
    it('should return requested number of posts', () => {
      const limit = 3;
      const recent = getRecentPosts(limit);

      expect(recent.length).toBeLessThanOrEqual(limit);
    });

    it('should return most recent posts', () => {
      const recent = getRecentPosts(3);
      const allPosts = getAllBlogPosts();

      recent.forEach((post, index) => {
        expect(post.slug).toBe(allPosts[index].slug);
      });
    });
  });

  describe('getAllTags', () => {
    it('should return unique tags', () => {
      const tags = getAllTags();
      const uniqueTags = [...new Set(tags)];

      expect(tags.length).toBe(uniqueTags.length);
    });

    it('should return tags from all posts', () => {
      const tags = getAllTags();
      const allPosts = getAllBlogPosts();
      const allPostTags = allPosts.flatMap((p) => p.frontmatter.tags);

      tags.forEach((tag) => {
        expect(allPostTags).toContain(tag);
      });
    });
  });
});
