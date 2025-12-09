"use client";
import Image from "next/image";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

interface Props {
  images: string[];
  title: string;
  initialSlide?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageLightbox({ images, title, initialSlide = 0, open, setOpen }: Props) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      className="imageLightbox__content"
      overlayClassName="imageLightbox__overlay"
      bodyOpenClassName="imageLightbox__bodyOpen"
      ariaHideApp={false}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <div className="imageLightbox__inner">
        {/* Close button */}
        <button
          className="imageLightbox__close btn btn-round btn-round-small btn-outline"
          onClick={() => setOpen(false)}
        >
          <i className="ph ph-x" />
        </button>

        {/* Title */}
        <div className="imageLightbox__title">
          <h4>{title}</h4>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          slidesPerView={1}
          initialSlide={initialSlide}
          navigation={{
            nextEl: ".lightbox-next",
            prevEl: ".lightbox-prev",
          }}
          pagination={{
            el: ".lightbox-pagination",
            type: "fraction",
          }}
          keyboard={{ enabled: true }}
          loop={images.length > 1}
          grabCursor={true}
          speed={500}
          className="imageLightbox__swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="imageLightbox__slide">
                <Image
                  src={img}
                  alt={`${title} - Foto ${idx + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="100vw"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        {images.length > 1 && (
          <div className="imageLightbox__controls swiper-testimonials__controls">
            <div className="lightbox-prev mxd-slider-btn mxd-slider-btn-round-prev">
              <a
                className="btn btn-round btn-round-small btn-outline slide-left anim-no-delay"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <i className="ph ph-arrow-left" />
              </a>
            </div>
            <div className="lightbox-pagination mxd-swiper-pagination-fraction" />
            <div className="lightbox-next mxd-slider-btn mxd-slider-btn-round-next">
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
      </div>

      <style jsx global>{`
        .imageLightbox__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .imageLightbox__content {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 1400px;
          max-height: 90vh;
          margin: auto;
          outline: none;
        }
        .imageLightbox__inner {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .imageLightbox__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 100;
          background: var(--color-base) !important;
        }
        .imageLightbox__title {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 100;
          color: #fff;
        }
        .imageLightbox__title h4 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .imageLightbox__swiper {
          width: 100%;
          height: 100%;
        }
        .imageLightbox__slide {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .imageLightbox__controls {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-base);
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          gap: 1.5rem;
          z-index: 100;
          width: auto;
        }
        .imageLightbox__controls .mxd-slider-btn {
          position: relative;
          bottom: auto;
          left: auto;
          right: auto;
        }
        .imageLightbox__controls .mxd-swiper-pagination-fraction {
          position: relative;
          width: auto;
          min-width: 60px;
          text-align: center;
        }
        .imageLightbox__bodyOpen {
          overflow: hidden;
        }
      `}</style>
    </Modal>
  );
}
