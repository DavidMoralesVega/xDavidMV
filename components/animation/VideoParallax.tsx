"use client";

interface VideoSource {
  src: string;
  type: string;
}

interface VideoParallaxProps {
  src?: string;
  sources?: VideoSource[];
  poster?: string;
  className?: string;
}

export default function VideoParallax({
  src,
  sources,
  poster,
  className = "",
}: VideoParallaxProps) {
  return (
    <video
      className={className}
      poster={poster ? `/${poster}` : undefined}
      autoPlay
      loop
      muted
      playsInline
      aria-label="Video decorativo de fondo"
    >
      {sources ? (
        sources.map((source, index) => (
          <source
            key={index}
            src={`/${source.src}`}
            type={source.type}
          />
        ))
      ) : src ? (
        <source src={`/${src}`} type="video/webm" />
      ) : null}
      <track kind="captions" src="/videos/captions.vtt" srcLang="es" label="Español" default />
      Tu navegador no soporta el elemento de video.
    </video>
  );
}
