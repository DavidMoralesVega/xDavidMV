import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";

export default function ConferencesSection() {
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container">
        {/* Block - CTA Conferencias Start */}
        <div className="mxd-block">
          <div className="mxd-demo-cta">
            <div className="mxd-demo-cta__caption anim-uni-in-up">
              <RevealText as="h2" className="h2-small reveal-type">
                +16 conferencias y talleres en eventos tecnologicos de Bolivia
              </RevealText>
            </div>
            <div className="mxd-demo-cta__btn anim-uni-in-up">
              <AnimatedButton
                text="Ver conferencias"
                className="btn btn-anim btn-default btn-large btn-additional slide-right"
                href="/conferencias"
              >
                <i className="ph-bold ph-presentation-chart" />
              </AnimatedButton>
            </div>
          </div>
        </div>
        {/* Block - CTA Conferencias End */}
      </div>
    </div>
  );
}
