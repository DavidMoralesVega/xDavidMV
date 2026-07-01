import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";

export default function ProjectsSection() {
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container">
        {/* Block - CTA Proyectos Start */}
        <div className="mxd-block">
          <div className="mxd-demo-cta">
            <div className="mxd-demo-cta__caption anim-uni-in-up">
              <RevealText as="h2" className="h2-small reveal-type">
                20 productos en producción: plataformas institucionales, ERP/POS,
                PWA gubernamentales, LMS y un SaaS multi-tenant
              </RevealText>
            </div>
            <div className="mxd-demo-cta__btn anim-uni-in-up">
              <AnimatedButton
                text="Ver proyectos"
                className="btn btn-anim btn-default btn-large btn-additional slide-right"
                href="/proyectos"
              >
                <i className="ph-bold ph-stack" />
              </AnimatedButton>
            </div>
          </div>
        </div>
        {/* Block - CTA Proyectos End */}
      </div>
    </div>
  );
}
