"use client";
import { useState } from "react";
import Link from "next/link";

import ImageLightbox from "@/components/ui/ImageLightbox";
import { projects } from "@/data/projects.json";
import type { Project } from "./ProjectsMasonry";

export default function ProjectDetail({ slug }: { slug: string }) {
  const items = projects as Project[];
  const index = items.findIndex((p) => p.slug === slug);
  const project = items[index];

  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  if (!project) return null;

  const prev = index > 0 ? items[index - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : null;

  const openLightbox = (i: number) => {
    setSlide(i);
    setOpen(true);
  };

  return (
    <article className="project-detail">
      {/* HERO */}
      <section className="mxd-section pd-section pd-hero">
        <div className="mxd-container">
          <div className="pd-hero__head">
            <div className="pd-meta-top">
              <span className="tag tag-default tag-permanent">{project.category}</span>
              <span className="pd-year">{project.year}</span>
            </div>
            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-tagline">{project.tagline}</p>
            <div className="pd-actions">
              {project.liveUrl && (
                <a
                  className="btn btn-anim btn-default btn-additional slide-right-up"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn-caption">Ver en vivo</span>
                  <i className="ph ph-arrow-up-right" />
                </a>
              )}
              <Link className="pd-back" href="/proyectos">
                <i className="ph ph-squares-four" /> Todos los proyectos
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="pd-cover radius-l"
            onClick={() => openLightbox(0)}
            aria-label="Abrir galería"
          >
            <img src={project.cover} alt={project.coverAlt || project.title} />
            <span className="pd-cover__hint">
              <i className="ph ph-magnifying-glass-plus" /> Ver galería ({project.images.length})
            </span>
          </button>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="mxd-section pd-section">
        <div className="mxd-container">
          <div className="pd-info">
            <div className="pd-info__cell">
              <span className="pd-info__label">Cliente</span>
              <span className="pd-info__value">{project.client}</span>
            </div>
            <div className="pd-info__cell">
              <span className="pd-info__label">Rol</span>
              <span className="pd-info__value">{project.role}</span>
            </div>
            <div className="pd-info__cell">
              <span className="pd-info__label">Año</span>
              <span className="pd-info__value">{project.year}</span>
            </div>
            <div className="pd-info__cell pd-info__cell--stack">
              <span className="pd-info__label">Stack</span>
              <div className="pd-chips">
                {project.stack.map((tech, i) => (
                  <span key={i} className="pd-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mxd-section pd-section">
        <div className="mxd-container">
          <p className="pd-lead">{project.summary}</p>
        </div>
      </section>

      {/* CHALLENGE + SOLUTION */}
      <section className="mxd-section pd-section">
        <div className="mxd-container">
          <div className="pd-two">
            <div className="pd-col">
              <h2 className="pd-h2">
                <span className="pd-h2__num">01</span> El reto
              </h2>
              <p className="pd-body">{project.challenge}</p>
            </div>
            <div className="pd-col">
              <h2 className="pd-h2">
                <span className="pd-h2__num">02</span> La solución
              </h2>
              <p className="pd-body">{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mxd-section pd-section">
        <div className="mxd-container">
          <h2 className="pd-h2">
            <span className="pd-h2__num">03</span> Lo destacado
          </h2>
          <ul className="pd-highlights">
            {project.highlights.map((h, i) => (
              <li key={i}>
                <i className="ph ph-check-circle" aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GALLERY */}
      {project.images.length > 1 && (
        <section className="mxd-section pd-section">
          <div className="mxd-container">
            <h2 className="pd-h2">
              <span className="pd-h2__num">04</span> Galería
            </h2>
            <div className="pd-gallery">
              {project.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className="pd-gallery__item radius-l"
                  onClick={() => openLightbox(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={img} alt={`${project.title} — imagen ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PREV / NEXT */}
      <section className="mxd-section pd-section">
        <div className="mxd-container">
          <div className="pd-nav">
            {prev ? (
              <Link className="pd-nav__item pd-nav__prev" href={`/proyectos/${prev.slug}`}>
                <span className="pd-nav__dir">
                  <i className="ph ph-arrow-left" /> Anterior
                </span>
                <span className="pd-nav__name">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="pd-nav__item pd-nav__next" href={`/proyectos/${next.slug}`}>
                <span className="pd-nav__dir">
                  Siguiente <i className="ph ph-arrow-right" />
                </span>
                <span className="pd-nav__name">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>

      <ImageLightbox
        images={project.images}
        title={project.title}
        initialSlide={slide}
        open={open}
        setOpen={setOpen}
      />

      <style jsx global>{`
        .project-detail .pd-section {
          padding-top: 2.2rem;
          padding-bottom: 2.2rem;
        }
        .project-detail .pd-hero {
          padding-top: 3rem;
        }
        .pd-meta-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .pd-year {
          font-size: 0.9rem;
          opacity: 0.6;
          font-weight: 500;
        }
        .pd-title {
          font-size: clamp(2.1rem, 5vw, 4rem);
          line-height: 1.04;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
        }
        .pd-tagline {
          font-size: clamp(1.05rem, 2vw, 1.4rem);
          max-width: 62ch;
          opacity: 0.82;
          margin: 0 0 1.8rem;
        }
        .pd-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.2rem 1.8rem;
          margin-bottom: 2.6rem;
        }
        .pd-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: inherit;
          opacity: 0.7;
          transition: opacity 0.25s ease;
        }
        .pd-back:hover {
          opacity: 1;
          color: var(--accent);
        }
        .pd-cover {
          position: relative;
          display: block;
          width: 100%;
          padding: 0;
          border: none;
          cursor: zoom-in;
          overflow: hidden;
          background: color-mix(in srgb, currentColor 6%, transparent);
          aspect-ratio: 16 / 9;
        }
        .pd-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pd-cover:hover img {
          transform: scale(1.03);
        }
        .pd-cover__hint {
          position: absolute;
          bottom: 1.2rem;
          right: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--color-base, #fff);
          color: inherit;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
        }
        .pd-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem 2rem;
          padding: 1.8rem 0;
          border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
          border-bottom: 1px solid color-mix(in srgb, currentColor 14%, transparent);
        }
        .pd-info__cell {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pd-info__label {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.5;
          font-weight: 600;
        }
        .pd-info__value {
          font-size: 0.98rem;
          font-weight: 500;
        }
        .pd-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .pd-chip {
          font-size: 0.78rem;
          padding: 0.3rem 0.75rem;
          border-radius: 50px;
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          color: var(--accent);
          font-weight: 500;
          white-space: nowrap;
        }
        .pd-lead {
          font-size: clamp(1.15rem, 2.2vw, 1.6rem);
          line-height: 1.5;
          max-width: 40ch;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .pd-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem 3.5rem;
        }
        .pd-h2 {
          display: flex;
          align-items: baseline;
          gap: 0.9rem;
          font-size: clamp(1.4rem, 2.6vw, 2rem);
          margin: 0 0 1.1rem;
          letter-spacing: -0.01em;
        }
        .pd-h2__num {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent);
          opacity: 0.9;
        }
        .pd-body {
          font-size: 1.02rem;
          line-height: 1.65;
          opacity: 0.85;
          max-width: 56ch;
        }
        .pd-highlights {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.9rem 2rem;
        }
        .pd-highlights li {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-size: 1rem;
          line-height: 1.45;
        }
        .pd-highlights li i {
          color: var(--accent);
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }
        .pd-gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem;
        }
        .pd-gallery__item {
          position: relative;
          padding: 0;
          border: none;
          cursor: zoom-in;
          overflow: hidden;
          background: color-mix(in srgb, currentColor 6%, transparent);
          aspect-ratio: 16 / 10;
        }
        .pd-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pd-gallery__item:hover img {
          transform: scale(1.05);
        }
        .pd-nav {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
        }
        .pd-nav__item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          color: inherit;
          max-width: 45%;
          transition: transform 0.25s ease;
        }
        .pd-nav__next {
          text-align: right;
          align-items: flex-end;
        }
        .pd-nav__prev:hover {
          transform: translateX(-4px);
        }
        .pd-nav__next:hover {
          transform: translateX(4px);
        }
        .pd-nav__dir {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.55;
          font-weight: 600;
        }
        .pd-nav__name {
          font-weight: 600;
          font-size: 1.02rem;
        }
        .pd-nav__item:hover .pd-nav__name {
          color: var(--accent);
        }
        @media (max-width: 767px) {
          .pd-info {
            grid-template-columns: 1fr;
          }
          .pd-two {
            grid-template-columns: 1fr;
          }
          .pd-highlights {
            grid-template-columns: 1fr;
          }
          .pd-gallery {
            grid-template-columns: 1fr;
          }
          .pd-nav__item {
            max-width: 48%;
          }
        }
      `}</style>
    </article>
  );
}
