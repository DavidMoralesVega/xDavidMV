import AnimatedButton from "@/components/animation/AnimatedButton";
import RevealText from "@/components/animation/RevealText";

export default function About() {
  return (
    <div id="about" className="mxd-section padding-default" style={{ paddingTop: "12rem" }}>
      <div className="mxd-container grid-container">
        {/* Block - About Description with Manifest Start */}
        <div className="mxd-block">
          <div className="container-fluid px-0">
            <div className="row gx-0 d-xl-flex justify-content-xl-center">
              <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                <div className="mxd-block__content">
                  <div className="mxd-block__manifest centered anim-uni-in-up">
                    <RevealText
                      as="p"
                      className="mxd-manifest mxd-manifest-l reveal-type"
                    >
                      Diseño ecosistemas digitales escalables alineando
                      estrategia de negocio, cumplimiento normativo y
                      tecnología. Mi perfil híbrido único combina Ingeniería de
                      Sistemas y Derecho para liderar equipos de alto
                      rendimiento.
                    </RevealText>
                    <div className="mxd-manifest__controls anim-uni-in-up">
                      <div className="mxd-btngroup centered">
                        <AnimatedButton
                          text="Ver conferencias"
                          className="btn btn-anim btn-default btn-accent slide-right-up"
                          href="/conferencias"
                        >
                          <i className="ph-bold ph-arrow-up-right" />
                        </AnimatedButton>
                        <AnimatedButton
                          text="Descargar CV"
                          as={"a"}
                          className="btn btn-anim btn-default btn-outline slide-down"
                          href="/img/brand/DavidMoralesVega-CV.pdf"
                        >
                          <i className="ph-bold ph-arrow-down" />
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - About Description with Manifest End */}
      </div>
    </div>
  );
}
