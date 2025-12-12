"use client";

import { useState } from "react";
import services from "@/data/services.json";
import { Service } from "@/types/services";
import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";

type HoverState = {
  activeIndex: number | null;
  x: number;
};
export default function Services() {
  const [hoverState, setHoverState] = useState<HoverState>({
    activeIndex: null,
    x: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setHoverState({
      activeIndex: index,
      x: e.clientX,
    });
  };

  const handleMouseLeave = () => {
    setHoverState((pre) => {
      return {
        activeIndex: null,
        x: pre.x,
      };
    });
  };
  return (
    <div className="mxd-section overflow-hidden" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="mxd-container grid-container">
        {/* Block - Section Title Start */}
        <div className="mxd-block">
          <div className="mxd-section-title">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrtitle anim-uni-in-up">
                    <RevealText as="h2" className="reveal-type">
                      Mi expertise
                    </RevealText>
                  </div>
                </div>
                <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrdescr">
                    <p className="anim-uni-in-up">Arquitectura</p>
                    <p className="anim-uni-in-up">Desarrollo</p>
                    <p className="anim-uni-in-up">Liderazgo</p>
                  </div>
                </div>
                <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrcontrols anim-uni-in-up">
                    <AnimatedButton
                      text="Hablemos"
                      className="btn btn-anim btn-default btn-outline slide-right-up"
                      href="/contacto"
                    >
                      <i className="ph-bold ph-arrow-up-right" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Section Title End */}
        {/* Block - Services List Start */}
        <div className="mxd-block">
          <div className="mxd-services-list hover-reveal">
            {services.map((s: Service, idx: number) => (
              <div
                key={idx}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
                className="mxd-services-list__item hover-reveal__item"
              >
                <div className="mxd-services-list__border anim-uni-in-up" />
                <div
                  style={{
                    opacity: hoverState.activeIndex === idx ? 1 : 0,
                    transform: "translate(-80%, -50%)",
                    left: hoverState.x,

                    pointerEvents: "none",
                    transition: "opacity 0.3s ease",
                  }}
                  className="hover-reveal__content hover-reveal-360x440"
                >
                  <img
                    style={{
                      transform:
                        hoverState.activeIndex === idx
                          ? "scale(1,1)"
                          : "scale(1,1.4)",
                      transition: "transform 0.3s ease",
                    }}
                    className="hover-reveal__image"
                    alt=""
                    src={s.image}
                    width="360"
                    height="440"
                  />
                </div>
                <div className="mxd-services-list__inner">
                  <div className="container-fluid px-0">
                    <div className="row gx-0">
                      <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                        <div className="mxd-services-list__title anim-uni-in-up">
                          <p style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>{s.title}</p>
                        </div>
                      </div>
                      <div className="col-12 col-xl-4 mxd-grid-item no-margin">
                        <div className="mxd-services-list__descr anim-uni-in-up">
                          <p>{s.desc}</p>
                        </div>
                      </div>
                      <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                        <div className="mxd-services-list__tagslist">
                          <ul>
                            {s.tags.map((tag, tIdx) => (
                              <li key={tIdx} className="anim-uni-in-up">
                                <p>{tag}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mxd-services-list__border anim-uni-in-up" />
              </div>
            ))}
          </div>
        </div>
        {/* Block - Services List End */}
      </div>
    </div>
  );
}
