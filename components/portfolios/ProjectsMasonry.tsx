"use client";
import { useEffect } from "react";
import Link from "next/link";

import MasonryGrid from "../animation/MasonryGrid";
import { projects } from "@/data/projects.json";

export interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  client: string;
  role: string;
  stack: string[];
  liveUrl: string | null;
  featured: boolean;
  cover: string;
  coverAlt?: string;
  images: string[];
  imageAlts?: string[];
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  highlights: string[];
}

export default function ProjectsMasonry() {
  const items = projects as Project[];

  // Robust card reveal, independent of the template's GSAP/ScrollTrigger reveal
  // (which races with the isotope masonry layout and can leave cards stuck hidden).
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".proj-reveal")
    );
    if (!els.length) return;
    const reveal = (el: Element) => el.classList.add("proj-reveal--in");

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target);
              io?.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      els.forEach((el) => io!.observe(el));
    } else {
      els.forEach(reveal);
    }

    // Failsafe: whatever happens, everything is visible after 3s.
    const t = window.setTimeout(() => els.forEach(reveal), 3000);
    return () => {
      io?.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="mxd-section mxd-section-inner-headline grid-headline padding-default">
      <div className="mxd-container grid-l-container">
        <div className="mxd-block loading-wrap">
          <div className="mxd-projects-masonry loading__item">
            <div className="container-fluid p-0">
              <MasonryGrid
                className="row g-0 mxd-projects-masonry__gallery"
                data-masonry='{"percentPosition": true }'
                itemSelector=".mxd-projects-masonry__item"
              >
                {/* gallery title */}
                <div className="col-12 col-xl-6 mxd-projects-masonry__item mxd-projects-masonry__title headline-title">
                  <div className="mxd-block__inner-headline">
                    <h1 className="inner-headline__title headline-img-before headline-img-07">
                      Proyectos
                      <br />y productos
                    </h1>
                    <p
                      className="mxd-point-subtitle"
                      style={{ marginTop: "1.5rem" }}
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20px"
                        height="20px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill="currentColor"
                          d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                          c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                          c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                          c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                          c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                          c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                          c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"
                        />
                      </svg>
                      <span>{items.length} productos en producción</span>
                    </p>
                  </div>
                </div>

                {/* project cards */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item"
                  >
                    <Link
                      href={`/proyectos/${item.slug}`}
                      className="proj-card-link"
                      aria-label={`Ver caso de estudio: ${item.title}`}
                    >
                      <div className="mxd-project-item__media masonry-media proj-reveal">
                        <div className="mxd-project-item__preview masonry-preview radius-l proj-preview">
                          <img
                            src={item.cover}
                            alt={item.coverAlt || `${item.title} — ${item.tagline}`}
                            loading="lazy"
                          />
                        </div>

                        {/* category / year badge */}
                        <div className="proj-badge">
                          <span>{item.category}</span>
                          <span className="proj-badge__year">{item.year}</span>
                        </div>

                        {/* tags */}
                        <div className="mxd-project-item__tags conf-tags proj-tags">
                          {item.tags.slice(0, 4).map((tag, idx) => (
                            <span key={idx} className="tag tag-default tag-permanent">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* view case study cue */}
                        <div className="proj-cue">
                          <span>Ver caso</span>
                          <i className="ph ph-arrow-up-right" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="mxd-project-item__promo masonry-promo">
                        <div className="mxd-project-item__name">
                          <span className="proj-title">{item.title}</span>
                        </div>
                        <p className="t-small t-muted proj-tagline">{item.tagline}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </MasonryGrid>

              {/* CTA rotating button */}
              <div className="mxd-projects-masonry__btngroup anim-uni-in-up">
                <Link className="btn btn-anim btn-default btn-additional slide-right-up" href="/contacto">
                  <span className="btn-caption">Hablemos de tu proyecto</span>
                  <i className="ph ph-arrow-up-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .proj-card-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }
        .proj-reveal {
          opacity: 0;
          transform: translateY(26px);
          transition:
            opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .proj-reveal--in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .proj-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
        .mxd-project-item__media.masonry-media {
          height: 420px;
          position: relative;
          overflow: hidden;
        }
        @media only screen and (min-width: 768px) {
          .mxd-project-item__media.masonry-media {
            height: 540px;
          }
        }
        @media only screen and (min-width: 1600px) {
          .mxd-project-item__media.masonry-media {
            height: 620px;
          }
        }
        .proj-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .proj-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .proj-card-link:hover .proj-preview img {
          transform: scale(1.06);
        }
        .proj-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.9rem;
          background: var(--color-base);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
          max-width: calc(100% - 3rem);
        }
        .proj-badge span:first-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .proj-badge__year {
          opacity: 0.55;
        }
        .proj-tags {
          z-index: 20 !important;
          bottom: 0 !important;
          top: auto !important;
          padding: 1.5rem !important;
        }
        .proj-cue {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          background: var(--color-accent, #1a73e8);
          color: #fff;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .proj-card-link:hover .proj-cue {
          opacity: 1;
          transform: translateY(0);
        }
        .proj-title {
          font-weight: 600;
        }
        .proj-tagline {
          margin-top: 0.35rem;
          max-width: 46ch;
        }
        @media only screen and (min-width: 1200px) {
          .proj-tags {
            padding: 2.5rem !important;
          }
          .proj-badge,
          .proj-cue {
            top: 2rem;
          }
          .proj-badge {
            left: 2rem;
          }
          .proj-cue {
            right: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
