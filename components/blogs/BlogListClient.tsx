"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AnimatedButton from "../animation/AnimatedButton";

// -------------------- Types --------------------
interface BlogPostData {
  id: string;
  img: string;
  imgAlt: string;
  categories: string[];
  meta: string[];
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  readingTime: string;
}

interface CategoryData {
  name: string;
  count: number;
}

interface TagData {
  name: string;
  count: number;
}

interface BlogListClientProps {
  allPosts: BlogPostData[];
  categoriesWithCount: CategoryData[];
  tagsWithCount: TagData[];
  recentPosts: BlogPostData[];
  socials: { title: string; url: string }[];
}

// -------------------- Constants --------------------
const POSTS_PER_PAGE = 6;

// -------------------- Small helpers --------------------
const StarSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 20 20">
    <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
  </svg>
);

const MetaTag: React.FC<{ label: string; onClick?: () => void }> = ({
  label,
  onClick,
}) => (
  <span className="meta-tag">
    {onClick ? (
      <button type="button" onClick={onClick} className="meta-tag-btn">
        {label}
      </button>
    ) : (
      <span>{label}</span>
    )}
    <StarSvg />
  </span>
);

// Normalize string for search (remove accents, lowercase)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// -------------------- Component --------------------
export default function BlogListClient({
  allPosts,
  categoriesWithCount,
  tagsWithCount,
  recentPosts,
  socials,
}: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialCategory = searchParams.get("category") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialSearch = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // State
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Update URL when filters change
  const updateUrl = useCallback(
    (newCategory: string, newTag: string, newSearch: string, newPage: number) => {
      const params = new URLSearchParams();
      if (newCategory) params.set("category", newCategory);
      if (newTag) params.set("tag", newTag);
      if (newSearch) params.set("q", newSearch);
      if (newPage > 1) params.set("page", String(newPage));

      const queryString = params.toString();
      const newUrl = `/blog${queryString ? `?${queryString}` : ""}`;
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];

    // Filter by category
    if (category) {
      const normalizedCategory = normalizeString(category);
      posts = posts.filter((post) =>
        post.categories.some(
          (cat) => normalizeString(cat) === normalizedCategory
        )
      );
    }

    // Filter by tag
    if (tag) {
      const normalizedTag = normalizeString(tag);
      posts = posts.filter((post) =>
        post.meta.some((t) => normalizeString(t) === normalizedTag)
      );
    }

    // Filter by search
    if (search) {
      const normalizedSearch = normalizeString(search);
      posts = posts.filter((post) => {
        const titleMatch = normalizeString(post.title).includes(normalizedSearch);
        const excerptMatch = normalizeString(post.excerpt).includes(
          normalizedSearch
        );
        const tagsMatch = post.meta.some((t) =>
          normalizeString(t).includes(normalizedSearch)
        );
        return titleMatch || excerptMatch || tagsMatch;
      });
    }

    return posts;
  }, [allPosts, category, tag, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Separate featured and grid posts
  const featuredPost = paginatedPosts[0] || null;
  const gridPosts = paginatedPosts.slice(1);

  // Handlers
  const handleCategoryClick = (cat: string) => {
    const newCategory = category === cat ? "" : cat;
    setCategory(newCategory);
    setCurrentPage(1);
    updateUrl(newCategory, tag, search, 1);
  };

  const handleTagClick = (t: string) => {
    const newTag = tag === t ? "" : t;
    setTag(newTag);
    setCurrentPage(1);
    updateUrl(category, newTag, search, 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
    updateUrl(category, tag, searchInput, 1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
    updateUrl(category, tag, "", 1);
  };

  const handleClearFilters = () => {
    setCategory("");
    setTag("");
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
    router.push("/blog", { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(category, tag, search, page);
    // Scroll to top of posts
    document.getElementById("blog-posts")?.scrollIntoView({ behavior: "smooth" });
  };

  const hasActiveFilters = category || tag || search;

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validPage > 3) pages.push("ellipsis");
      const start = Math.max(2, validPage - 1);
      const end = Math.min(totalPages - 1, validPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (validPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Section - Inner Page Headline Start */}
      <div className="mxd-section mxd-section-inner-headline padding-blog-default-pre-grid">
        <div className="mxd-container grid-container">
          <div className="mxd-block loading-wrap">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                <div className="col-12" />
                <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                  <div className="mxd-block__content">
                    <div className="mxd-block__inner-headline loading__item">
                      <h1 className="inner-headline__title headline-img-before headline-img-06">
                        Publicaciones
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="col-12" />
              </div>

              <div className="row g-0">
                <div className="col-12" />
                {/* Headline tags */}
                <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                  <div className="inner-headline__blogtags loading__item">
                    {tagsWithCount.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => handleTagClick(t.name)}
                        className={`tag tag-default tag-outline tag-link-outline ${
                          tag === t.name ? "tag-active" : ""
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Breadcrumbs */}
                <div className="col-12 col-xl-4 mxd-grid-item no-margin">
                  <div className="inner-headline__breadcrumbs loading__fade">
                    <nav className="breadcrumbs__nav" aria-label="Breadcrumb">
                      <span>
                        <Link href="/">Inicio</Link>
                      </span>
                      <span className="current-item" aria-current="page">
                        Blog
                      </span>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section - Inner Page Headline End */}

      {/* Section - Blog Start */}
      <div className="mxd-section padding-default" id="blog-posts">
        <div className="mxd-container grid-container">
          <div className="mxd-posts-area loading__fade">
            {/* Posts Container Start */}
            <div className="mxd-posts-container mxd-grid-item">
              {/* No results message */}
              {filteredPosts.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <h3>No se encontraron artículos</h3>
                  <p style={{ opacity: 0.7, marginTop: "1rem" }}>
                    Intenta con otra búsqueda o categoría
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="btn btn-line-small btn-muted"
                      style={{ marginTop: "1rem" }}
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}

              {/* Featured Post */}
              {featuredPost && (
                <article className="mxd-post post-featured radius-m">
                  <Link
                    className="post-featured__thumb"
                    href={`/blog/${featuredPost.slug}`}
                  >
                    <Image
                      alt={featuredPost.imgAlt}
                      src={featuredPost.img}
                      width={1400}
                      height={900}
                      priority
                    />
                  </Link>

                  <div className="post-featured__categories">
                    {featuredPost.categories.slice(0, 3).map((c: string) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleCategoryClick(c)}
                        className="tag tag-default tag-outline-permanent tag-link-outline-premanent"
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="post-featured__content">
                    <div className="post-featured__meta">
                      {featuredPost.meta.slice(0, 3).map((m: string) => (
                        <MetaTag
                          key={m}
                          label={m}
                          onClick={() => handleTagClick(m)}
                        />
                      ))}
                      <span className="meta-date">{featuredPost.date}</span>
                    </div>

                    <h2 className="post-featured__title">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <div className="post-featured__excerpt">
                      <p>{featuredPost.excerpt}</p>
                    </div>
                  </div>
                </article>
              )}

              {/* Regular posts */}
              {gridPosts.map((p) => (
                <article className="mxd-post post-simple" key={p.id}>
                  <Link
                    className="post-simple__thumb radius-m"
                    href={`/blog/${p.slug}`}
                  >
                    <Image
                      alt={p.imgAlt}
                      src={p.img}
                      width={800}
                      height={680}
                    />
                    <div className="mxd-preview-hover">
                      <i className="mxd-preview-hover__icon icon-small">
                        <Image
                          alt="Eye Icon"
                          src="/img/icons/icon-eye.svg"
                          width={38}
                          height={21}
                        />
                      </i>
                    </div>
                  </Link>

                  <div className="post-simple__content">
                    <div className="post-simple__descr">
                      <div className="post-simple__meta">
                        {p.meta.slice(0, 2).map((m: string) => (
                          <MetaTag
                            key={m}
                            label={m}
                            onClick={() => handleTagClick(m)}
                          />
                        ))}
                        <span className="meta-date">{p.date}</span>
                      </div>

                      <div className="post-simple__title">
                        <h3>
                          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                        </h3>
                      </div>
                    </div>

                    <div className="post-simple__btn">
                      <AnimatedButton
                        className="btn btn-anim btn-default btn-outline slide-right-up"
                        text="Leer más"
                        href={`/blog/${p.slug}`}
                      >
                        <i className="ph ph-arrow-up-right" />
                      </AnimatedButton>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="mxd-blog-pagination"
                  role="navigation"
                  aria-label="Paginación del blog"
                >
                  <div className="mxd-blog-pagination__inner">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(validPage - 1)}
                      className={`blog-pagination-control prev ${
                        validPage <= 1 ? "disabled" : ""
                      }`}
                      disabled={validPage <= 1}
                      aria-label="Página anterior"
                    >
                      <i className="ph ph-arrow-left" aria-hidden="true" />
                      <span className="btn-caption">Anterior</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="mxd-blog-pagination__items">
                      {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="blog-pagination-ellipsis"
                            aria-hidden="true"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`blog-pagination-number ${
                              page === validPage ? "active" : ""
                            }`}
                            aria-label={`Página ${page}`}
                            aria-current={page === validPage ? "page" : undefined}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(validPage + 1)}
                      className={`blog-pagination-control next ${
                        validPage >= totalPages ? "disabled" : ""
                      }`}
                      disabled={validPage >= totalPages}
                      aria-label="Página siguiente"
                    >
                      <span className="btn-caption">Siguiente</span>
                      <i className="ph ph-arrow-right" aria-hidden="true" />
                    </button>
                  </div>
                </nav>
              )}
            </div>
            {/* Posts Container End */}

            {/* Sidebar Start */}
            <aside className="mxd-sidebar mxd-grid-item">
              {/* Search widget */}
              <div className="mxd-sidebar__widget bg-base-tint radius-m widget-search">
                <div className="widget-search__form">
                  <form className="form search-form" onSubmit={handleSearch}>
                    <input
                      id="search"
                      type="search"
                      name="search"
                      placeholder="Buscar artículos..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button
                      className="btn btn-form no-scale btn-absolute-right btn-muted"
                      type="submit"
                    >
                      <i className="ph ph-magnifying-glass" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Categories widget */}
              <div className="mxd-sidebar__widget bg-base-tint radius-m">
                <div className="widget__title">
                  <p>Categorías</p>
                </div>
                <ul className="widget__categories">
                  {categoriesWithCount.map((c) => (
                    <li className="categories__item" key={c.name}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(c.name)}
                        className={`categories__link ${
                          category === c.name ? "active" : ""
                        }`}
                      >
                        {c.name}
                        <span className="categories__count">({c.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent posts */}
              <div className="mxd-sidebar__widget bg-base-tint radius-m">
                <div className="widget__title">
                  <p>Últimas publicaciones</p>
                </div>
                <ul className="widget__recent-posts">
                  {recentPosts.map((rp) => (
                    <li className="recent-post__item" key={rp.slug}>
                      <div className="recent-post__thumb">
                        <Link href={`/blog/${rp.slug}`}>
                          <Image
                            alt={rp.imgAlt}
                            src={rp.img}
                            width={300}
                            height={300}
                          />
                        </Link>
                      </div>
                      <div className="recent-post__content">
                        <div className="recent-post__meta">
                          <span className="meta-tag">
                            <StarSvg />
                            <button
                              type="button"
                              onClick={() => handleCategoryClick(rp.categories[0])}
                              className="meta-tag-btn"
                            >
                              {rp.categories[0]}
                            </button>
                          </span>
                        </div>
                        <div className="recent-post__title">
                          <Link href={`/blog/${rp.slug}`}>
                            {rp.title.length > 60
                              ? `${rp.title.substring(0, 60)}...`
                              : rp.title}
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags Widget */}
              {/* <div className="mxd-sidebar__widget bg-base-tint radius-m">
                <div className="widget__title">
                  <p>Tags</p>
                </div>
                <div className="widget__tags">
                  {tagsWithCount.slice(0, 10).map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => handleTagClick(t.name)}
                      className={`tag tag-default tag-outline tag-link-outline ${
                        tag === t.name ? "tag-active" : ""
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* About widget */}
              <div className="mxd-sidebar__widget bg-base-tint radius-m widget-about">
                <div className="widget__title">
                  <p>Sobre el Blog</p>
                </div>
                <div className="widget__descr">
                  <p className="t-small">
                    Artículos sobre arquitectura de software, desarrollo web,
                    metodologías ágiles y reflexiones sobre la industria tech.
                    Contenido práctico desde la experiencia real.
                  </p>
                </div>
              </div>

              {/* Socials */}
              <div className="mxd-sidebar__widget bg-base-tint radius-m widget-socials">
                <div className="widget__title">
                  <p>Ecosistema</p>
                </div>
                <div className="widget__descr">
                  <p className="t-small">
                    Sígueme para estar al tanto de nuevas publicaciones y
                    contenido técnico.
                  </p>
                </div>

                <div className="widget__social-links-small">
                  {socials.map(({ title, url }) => (
                    <div className="social-links-small__item" key={title}>
                      <div className="social-links-small__divider" />
                      <a
                        className="social-links-small__link"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="social-links-small__title">{title}</p>
                        <div className="social-links-small__icon">
                          <i className="ph-bold ph-arrow-up-right" />
                        </div>
                      </a>
                      <div className="social-links-small__divider" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            {/* Sidebar End */}
          </div>
        </div>
      </div>
      {/* Section - Blog End */}
    </>
  );
}
