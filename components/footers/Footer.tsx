import Link from "next/link";
import footerNav from "@/data/footer-nav.json";
import socials from "@/data/socials.json";
import AnimatedButton from "../animation/AnimatedButton";
import SubscribeForm from "./SubscribeForm";

export default function Footer({ text = "David Morales Vega" }: { text?: string }) {
  return (
    <footer id="mxd-footer" className="mxd-footer">
      {/* Footer Block - Fullwidth Text Start */}
      <div className="mxd-footer__text-wrap">
        <div className="fullwidth-text__tl-trigger" />
        <div className="mxd-footer__fullwidth-text anim-top-to-bottom">
          <h1
            className="mxd-footer__text-content"
            style={{
              fontSize: "clamp(6rem, 15vw, 12rem)",
              marginBottom: "4rem",
            }}
          >
            {text}
          </h1>
        </div>
      </div>
      {/* Footer Block - Fullwidth Text End */}
      {/* Footer Block - Info Columns Start */}
      <div className="mxd-footer__footer-blocks">
        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card fullheight-card">
            {/* footer navigation */}
            <div className="footer-blocks__nav">
              <ul className="footer-nav">
                {footerNav.map(
                  (
                    item: { label: string; href: string; counter?: number },
                    idx: number
                  ) => (
                    <li className="footer-nav__item anim-uni-in-up" key={idx}>
                      <AnimatedButton
                        href={item.href}
                        text={item.label}
                        className="footer-nav__link btn-anim"
                      />

                      {item.counter && (
                        <p className="footer-nav__counter">
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
                          <span>{item.counter}</span>
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
            {/* links */}
            <div className="footer-blocks__links anim-uni-in-up">
              <AnimatedButton
                text="Política de privacidad"
                as={"a"}
                className="btn btn-line-xsmall btn-muted slide-right anim-no-delay"
                href="#"
              >
                <i className="ph ph-arrow-right" />
              </AnimatedButton>
              <AnimatedButton
                text="Términos y condiciones"
                as={"a"}
                className="btn btn-line-xsmall btn-muted slide-right anim-no-delay"
                href="#"
              >
                <i className="ph ph-arrow-right" />
              </AnimatedButton>
            </div>
          </div>
        </div>
        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card">
            <p className="mxd-point-subtitle anim-uni-in-up">
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
              <a href="mailto:moralesvegadavid@gmail.com?subject=Contacto%20desde%20tu%20sitio%20web">
                moralesvegadavid@gmail.com
              </a>
            </p>
          </div>
          {/* inner card */}
          <div className="footer-blocks__card">
            <p className="mxd-point-subtitle anim-uni-in-up">
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
              <a href="tel:+59161816001">+591 61816001</a>
            </p>
          </div>
          {/* inner card */}
          <div className="footer-blocks__card fill-card notify">
            {/* card title */}
            <div className="footer-blocks__title anim-uni-in-up">
              <p className="footer-blocks__title-m">
                Suscríbete a mis novedades:
              </p>
            </div>
            {/* subscribe form container */}
            <div className="form-container anim-uni-in-up">
              {/* reply messages */}
              <div className="form__reply subscription-ok">
                <span className="reply__text">
                  Listo! Gracias por suscribirte.
                </span>
              </div>
              <div className="form__reply subscription-error">
                <span className="reply__text">
                  Oops! Algo salió mal. Intenta de nuevo más tarde.
                </span>
              </div>
              {/* subscribe form */}
              <SubscribeForm />
            </div>
          </div>
        </div>
        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card fullheight-card">
            {/* nav block */}
            <div className="footer-blocks__block">
              {/* card title */}
              <div className="footer-blocks__title anim-uni-in-up">
                <p className="footer-blocks__title-l">Redes</p>
              </div>
              {/* footer socials */}
              <div className="footer-blocks__socials">
                <ul className="footer-socials">
                  {socials.map((social, i) => (
                    <li key={i} className="footer-socials__item anim-uni-in-up">
                      <a
                        href={social.url}
                        className="footer-socials__link"
                        target="_blank"
                      >
                        {social.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* links */}
            <div className="footer-blocks__links anim-uni-in-up">
              <p className="t-xsmall t-muted">
                <a
                  className="no-effect"
                  href="https://www.moralesvegadavid.com"
                  target="_blank"
                >
                  David Morales Vega
                </a>
                <i className="ph-bold ph-copyright" />
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Block - Info Columns End */}
    </footer>
  );
}
