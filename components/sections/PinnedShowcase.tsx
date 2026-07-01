"use client";
import Link from "next/link";

import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";

export interface ShowcaseItem {
  key: string | number;
  href: string;
  cover: string;
  coverAlt?: string;
  tags: string[];
  title: string;
  tagline: string;
}

interface Props {
  headingLine1: string;
  headingLine2: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  cueLabel?: string;
  items: ShowcaseItem[];
}

export default function PinnedShowcase({
  headingLine1,
  headingLine2,
  description,
  buttonText,
  buttonHref,
  cueLabel = "Ver más",
  items,
}: Props) {
  return (
    <div className="mxd-section padding-default pshowcase">
      <div className="mxd-container grid-container">
        <div className="mxd-block">
          <div className="mxd-pinned-projects">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                {/* Static column: title + description + CTA */}
                <div className="col-12 col-xl-5 mxd-pinned-projects__static">
                  <div className="mxd-pinned-projects__static-inner no-margin">
                    <div className="mxd-section-title no-margin-desktop">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__title anim-uni-in-up">
                              <RevealText as="h2" className="reveal-type">
                                {headingLine1}
                                <br />
                                {headingLine2}
                              </RevealText>
                            </div>
                          </div>
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__descr anim-uni-in-up">
                              <p>{description}</p>
                            </div>
                          </div>
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__controls anim-uni-in-up">
                              <AnimatedButton
                                text={buttonText}
                                className="btn btn-anim btn-default btn-accent slide-right-up"
                                href={buttonHref}
                              >
                                <i className="ph-bold ph-arrow-up-right" />
                              </AnimatedButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scroll column: thumbnails */}
                <div className="col-12 col-xl-7 mxd-pinned-projects__scroll">
                  <div className="mxd-pinned-projects__scroll-inner mxd-grid-item no-margin">
                    {items.map((item) => (
                      <div key={item.key} className="mxd-project-item">
                        <Link
                          className="mxd-project-item__media anim-uni-in-up"
                          href={item.href}
                          aria-label={item.title}
                        >
                          <div className="mxd-project-item__preview ps-preview radius-l">
                            <img
                              src={item.cover}
                              alt={item.coverAlt || item.title}
                              loading="lazy"
                            />
                          </div>
                          <div className="mxd-project-item__tags ps-tags">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="tag tag-default tag-permanent">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="ps-cue">
                            {cueLabel} <i className="ph ph-arrow-up-right" />
                          </span>
                        </Link>
                        <div className="mxd-project-item__promo">
                          <div className="mxd-project-item__name">
                            <Link href={item.href}>
                              <span>{item.title}</span>
                            </Link>
                          </div>
                          <p className="t-small t-muted ps-tagline">{item.tagline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .pshowcase .mxd-pinned-projects__scroll-inner {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }
        .pshowcase .mxd-project-item__media {
          position: relative;
          display: block;
          height: 380px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .pshowcase .mxd-project-item__media {
            height: 460px;
          }
        }
        @media (min-width: 1600px) {
          .pshowcase .mxd-project-item__media {
            height: 520px;
          }
        }
        .pshowcase .ps-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .pshowcase .ps-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pshowcase .mxd-project-item__media:hover .ps-preview img {
          transform: scale(1.05);
        }
        .pshowcase .ps-tags {
          position: absolute;
          z-index: 20;
          bottom: 0;
          left: 0;
          top: auto;
          padding: 1.5rem;
        }
        .pshowcase .ps-cue {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: 50px;
          background: var(--accent);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .pshowcase .mxd-project-item__media:hover .ps-cue {
          opacity: 1;
          transform: translateY(0);
        }
        .pshowcase .ps-tagline {
          margin-top: 0.35rem;
          max-width: 52ch;
        }
      `}</style>
    </div>
  );
}
