"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import conferencesData from "@/data/conferences-full.json";

interface Event {
  id: number;
  type: string;
  title: string;
  date: string;
  description: string;
  topics?: string[];
  stack?: string[];
  images: string[];
}

interface Institution {
  id: string;
  name: string;
  logo: string;
  events: Event[];
}

export default function ConferencesGallery() {
  const { institutions } = conferencesData as { institutions: Institution[] };

  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container">
        {/* Page Header */}
        <div className="mxd-block loading-wrap">
          <div className="mxd-block__inner-headline loading__item">
            <h1 className="inner-headline__title headline-img-before headline-img-07">
              Conferencias
              <br />y talleres
            </h1>
            <p className="inner-headline__text t-large t-bright" style={{ marginTop: "1.5rem" }}>
              +16 ponencias, workshops y actividades docentes en eventos
              tecnológicos de Bolivia y Latinoamérica.
            </p>
          </div>
        </div>

        {/* Institutions Loop */}
        {institutions.map((institution) => (
          <div key={institution.id} className="mxd-block" style={{ marginTop: "4rem" }}>
            {/* Institution Header */}
            <div className="conferences-institution-header" style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--color-border)"
            }}>
              <div className="institution-logo" style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "var(--color-base-tint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Image
                  src={institution.logo}
                  alt={institution.name}
                  width={60}
                  height={60}
                  style={{ objectFit: "contain" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="h4" style={{ margin: 0 }}>{institution.name}</h2>
                <p className="t-small t-muted" style={{ margin: 0 }}>
                  {institution.events.length} {institution.events.length === 1 ? 'evento' : 'eventos'}
                </p>
              </div>
            </div>

            {/* Events Grid */}
            <div className="conferences-events-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "2rem"
            }}>
              {institution.events.map((event) => (
                <div key={event.id} className="conference-event-card" style={{
                  background: "var(--color-base-tint)",
                  borderRadius: "16px",
                  overflow: "hidden"
                }}>
                  {/* Image Slider */}
                  <div className="event-slider" style={{ position: "relative" }}>
                    <Swiper
                      modules={[Navigation, Pagination]}
                      slidesPerView={1}
                      navigation={{
                        nextEl: `.swiper-next-${event.id}`,
                        prevEl: `.swiper-prev-${event.id}`,
                      }}
                      pagination={{
                        el: `.swiper-pagination-${event.id}`,
                        type: "bullets",
                        clickable: true,
                      }}
                      loop={event.images.length > 1}
                      grabCursor={true}
                      style={{ borderRadius: "16px 16px 0 0" }}
                    >
                      {event.images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <div style={{
                            width: "100%",
                            height: "280px",
                            position: "relative",
                            background: "var(--color-base-opp)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Image
                              src={img}
                              alt={`${event.title} - Foto ${idx + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/img/placeholder-conference.webp';
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Slider Controls */}
                    {event.images.length > 1 && (
                      <>
                        <button
                          className={`swiper-prev-${event.id}`}
                          style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <i className="ph ph-arrow-left" style={{ color: "#000" }} />
                        </button>
                        <button
                          className={`swiper-next-${event.id}`}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <i className="ph ph-arrow-right" style={{ color: "#000" }} />
                        </button>
                        <div
                          className={`swiper-pagination-${event.id}`}
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 10
                          }}
                        />
                      </>
                    )}

                    {/* Photo Count Badge */}
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      zIndex: 5
                    }}>
                      <i className="ph ph-images" style={{ marginRight: "4px" }} />
                      {event.images.length} {event.images.length === 1 ? 'foto' : 'fotos'}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="event-content" style={{ padding: "1.5rem" }}>
                    {/* Type Badge */}
                    <span className="tag tag-default tag-outline" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
                      {event.type}
                    </span>

                    {/* Title */}
                    <h3 className="h5" style={{ marginBottom: "0.5rem" }}>
                      {event.title}
                    </h3>

                    {/* Date */}
                    <p className="t-small t-muted" style={{ marginBottom: "1rem" }}>
                      <i className="ph ph-calendar" style={{ marginRight: "6px" }} />
                      {event.date}
                    </p>

                    {/* Description */}
                    <p className="t-small" style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
                      {event.description}
                    </p>

                    {/* Stack/Topics Tags */}
                    <div className="event-tags" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(event.stack || event.topics || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="tag tag-small"
                          style={{
                            background: "var(--color-accent)",
                            color: "var(--color-base)",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 500
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Total Stats */}
        <div className="mxd-block" style={{
          marginTop: "4rem",
          padding: "2rem",
          background: "var(--color-base-tint)",
          borderRadius: "16px",
          textAlign: "center"
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <h2 className="h1" style={{ marginBottom: "0.25rem" }}>16+</h2>
              <p className="t-muted">Ponencias y talleres</p>
            </div>
            <div>
              <h2 className="h1" style={{ marginBottom: "0.25rem" }}>8</h2>
              <p className="t-muted">Instituciones</p>
            </div>
            <div>
              <h2 className="h1" style={{ marginBottom: "0.25rem" }}>6+</h2>
              <p className="t-muted">Años compartiendo conocimiento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
