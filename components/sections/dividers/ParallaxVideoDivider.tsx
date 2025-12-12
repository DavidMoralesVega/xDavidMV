import VideoParallax from "@/components/animation/VideoParallax";

export default function ParallaxVideoDivider() {
  return (
    <div className="mxd-section padding-grid-pre-pinned">
      <div className="mxd-container">
        <div className="mxd-divider">
          <div className="mxd-divider__video">
            <VideoParallax
              className="video parallax-video"
              sources={[
                { src: "video/hero-video.webm", type: "video/webm" },
                { src: "video/hero-video.mp4", type: "video/mp4" },
              ]}
              poster="video/hero-video.webp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
