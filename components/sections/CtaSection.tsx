import Link from "next/link";
import Image from "next/image";

import AnimatedButton from "@/components/animation/AnimatedButton";

export default function CtaSection() {
  return (
    <div className="mxd-section overflow-hidden">
      <div className="mxd-container">
        {/* Block - CTA Start */}
        <div className="mxd-block">
          <div className="mxd-promo">
            <div className="mxd-promo__inner anim-zoom-out-container">
              {/* background */}
              <div className="mxd-promo__bg" />
              {/* caption */}
              <div className="mxd-promo__content">
                <p className="mxd-promo__title anim-uni-in-up">
                  <span className="mxd-promo__icon">
                    <Image
                      alt="Icon"
                      src="/img/brand/bemorex.png"
                      width={400}
                      height={400}
                    />
                  </span>
                  <span className="mxd-promo__caption">
                    Hablemos de tu proyecto!
                  </span>
                </p>
                <div className="mxd-promo__controls anim-uni-in-up">
                  <AnimatedButton
                    text="Contáctame"
                    className="btn btn-anim btn-default btn-large btn-additional slide-right-up"
                    href={`/contacto`}
                  >
                    <i className="ph-bold ph-arrow-up-right" />
                  </AnimatedButton>
                </div>
              </div>
              {/* parallax images */}
              <div className="mxd-promo__images">
                {/* <Image
                  className="promo-image promo-image-1"
                  alt="Image"
                  src="/img/brand/cta.jpg"
                  width={800}
                  height={912}
                />
                <Image
                  className="promo-image promo-image-2"
                  alt="Image"
                  src="/img/illustrations/cta-img-02.webp"
                  width={600}
                  height={601}
                /> */}
              </div>
            </div>
          </div>
        </div>
        {/* Block - CTA End */}
      </div>
    </div>
  );
}
