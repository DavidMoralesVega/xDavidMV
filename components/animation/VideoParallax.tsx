"use client";

interface VideoParallaxProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoParallax({
  src,
  poster,
  className = "",
}: VideoParallaxProps) {
  return (
    <video
      className={className}
      src={`/${src}`}
      poster={poster ? `/${poster}` : undefined}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
