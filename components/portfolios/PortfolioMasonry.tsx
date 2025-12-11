"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import AnimateRotation from "../animation/AnimateRotation";
import MasonryGrid from "../animation/MasonryGrid";
import ImageLightbox from "../common/ImageLightbox";
import { conferences } from "@/data/conferences.json";

interface Conference {
  id: number;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  anim: string;
  type: string;
  date: string;
  institution: string;
  stack: string[];
}

export default function PortfolioMasonry() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; title: string; initialSlide: number }>({
    images: [],
    title: "",
    initialSlide: 0,
  });

  const openLightbox = (item: Conference, slideIndex: number = 0) => {
    setLightboxData({
      images: item.images,
      title: `${item.title} ${item.description}`,
      initialSlide: slideIndex,
    });
    setLightboxOpen(true);
  };

  return (
    <div className="mxd-section mxd-section-inner-headline grid-headline padding-default">
      <div className="mxd-container grid-l-container">
        {/* Block - Projects Masonry #01 with Section Title Start */}
        <div className="mxd-block loading-wrap">
          <div className="mxd-projects-masonry loading__item">
            <div className="container-fluid p-0">
              {/* Portfolio Gallery Start */}
              <MasonryGrid
                className="row g-0 mxd-projects-masonry__gallery"
                data-masonry='{"percentPosition": true }'
                itemSelector=".mxd-projects-masonry__item"
              >
                {/* portfolio gallery title */}
                <div className="col-12 col-xl-6 mxd-projects-masonry__item mxd-projects-masonry__title headline-title">
                  <div className="mxd-block__inner-headline">
                    <h1 className="inner-headline__title headline-img-before headline-img-07">
                      Conferencias
                      <br />y talleres
                    </h1>
                    {/* Contador total */}
                    <p className="mxd-point-subtitle anim-uni-in-up" style={{ marginTop: "1.5rem" }}>
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
                      <span>{conferences.length} eventos desde 2019</span>
                    </p>
                  </div>
                </div>
                {/* portfolio gallery single item */}
                {(conferences as Conference[]).map((item) => (
                  <div
                    key={item.id}
                    className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item"
                  >
                    <div className={`mxd-project-item__media masonry-media ${item.anim}`}>
                      {/* Swiper for multiple images */}
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        slidesPerView={1}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoplay={{
                          delay: 4000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        navigation={{
                          nextEl: `.conf-next-${item.id}`,
                          prevEl: `.conf-prev-${item.id}`,
                        }}
                        pagination={{
                          el: `.conf-pagination-${item.id}`,
                          type: "fraction",
                        }}
                        loop={item.images.length > 1}
                        grabCursor={true}
                        speed={800}
                        className="mxd-conf-swiper radius-l"
                        onClick={() => openLightbox(item)}
                      >
                        {item.images.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <div className="mxd-project-item__preview masonry-preview radius-l">
                              <Image
                                src={img}
                                alt={`${item.title} - Foto ${idx + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {/* Navigation Controls */}
                      {item.images.length > 1 && (
                        <div className="swiper-testimonials__controls conf-controls">
                          <div className={`conf-prev-${item.id} mxd-slider-btn mxd-slider-btn-round-prev`}>
                            <a
                              className="btn btn-round btn-round-small btn-outline slide-left anim-no-delay"
                              href="#"
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="ph ph-arrow-left" />
                            </a>
                          </div>
                          <div className={`conf-pagination-${item.id} mxd-swiper-pagination-fraction`} />
                          <div className={`conf-next-${item.id} mxd-slider-btn mxd-slider-btn-round-next`}>
                            <a
                              className="btn btn-round btn-round-small btn-outline slide-right anim-no-delay"
                              href="#"
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="ph ph-arrow-right" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="mxd-project-item__tags conf-tags">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="tag tag-default tag-permanent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mxd-project-item__promo masonry-promo">
                      <div className="mxd-project-item__name">
                        <a href="#" onClick={(e) => { e.preventDefault(); openLightbox(item); }}>
                          <span>{item.title}</span> {item.description}
                        </a>
                      </div>
                      {/* Type and date */}
                      <p className="t-small t-muted">
                        {item.type} &bull; {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </MasonryGrid>
              {/* Portfolio Gallery End */}
              {/* Portfolio Link Start */}
              <div className="mxd-projects-masonry__btngroup anim-uni-in-up">
                <Link
                  className="btn-rotating btn-rotating-180 ver-02"
                  href={`/contacto`}
                >
                  <AnimateRotation
                    as="svg"
                    version="1.1"
                    id="scrollDown"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 160 160"
                    enableBackground={"new 0 0 160 160"}
                    xmlSpace="preserve"
                    className="btn-rotating__text animate-rotation"
                    value={360}
                  >
                    <defs>
                      <path
                        id="textPath"
                        d="M149.7,80c0,38.5-31.2,69.7-69.7,69.7S10.3,118.5,10.3,80S41.5,10.3,80,10.3S149.7,41.5,149.7,80z"
                      />
                    </defs>
                    <g>
                      <use xlinkHref="#textPath" fill="none" />
                      <text>
                        <textPath xlinkHref="#textPath">
                          Hablemos de tu proyecto * Hablemos de tu proyecto *
                        </textPath>
                      </text>
                    </g>
                  </AnimateRotation>
                  <Image
                    className="btn-rotating__image"
                    alt="Object"
                    src="/img/icons/300x300_obj-btn-03.webp"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>
              {/* Portfolio Link End */}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxData.images}
        title={lightboxData.title}
        initialSlide={lightboxData.initialSlide}
        open={lightboxOpen}
        setOpen={setLightboxOpen}
      />

      <style jsx global>{`
        .mxd-conf-swiper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
        }
        .mxd-conf-swiper .swiper-slide {
          overflow: hidden;
        }
        .mxd-conf-swiper .mxd-project-item__preview {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        /* Tags */
        .conf-tags {
          z-index: 20 !important;
          bottom: 0 !important;
          top: auto !important;
          padding: 1.5rem !important;
        }
        /* Controls */
        .conf-controls {
          position: absolute;
          top: auto;
          bottom: 1.5rem;
          right: 1.5rem;
          left: auto;
          width: auto;
          padding: 0.5rem 0.8rem;
          background: var(--color-base);
          border-radius: 50px;
          gap: 0.8rem;
          z-index: 20;
        }
        .conf-controls .mxd-slider-btn {
          position: relative;
          bottom: auto;
          left: auto;
          right: auto;
        }
        .conf-controls .mxd-swiper-pagination-fraction {
          position: relative;
          width: auto;
          min-width: 40px;
          text-align: center;
          font-size: 12px;
        }
        .conf-controls .btn-round-small {
          width: 32px;
          height: 32px;
        }
        /* Responsive */
        @media only screen and (max-width: 767px) {
          .conf-controls {
            bottom: 4.5rem;
          }
        }
        @media only screen and (min-width: 768px) {
          .conf-tags {
            padding: 2rem !important;
          }
          .conf-controls {
            padding: 0.6rem 1rem;
            gap: 1.2rem;
          }
          .conf-controls .mxd-swiper-pagination-fraction {
            min-width: 50px;
            font-size: 14px;
          }
          .conf-controls .btn-round-small {
            width: 36px;
            height: 36px;
          }
        }
        @media only screen and (min-width: 1200px) {
          .conf-tags {
            padding: 3rem !important;
          }
          .conf-controls {
            padding: 0.8rem 1.2rem;
            gap: 1.5rem;
          }
          .conf-controls .btn-round-small {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
