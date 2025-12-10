import React from "react";

interface RevealTextProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  start?: string;
}

export default function RevealText({
  children,
  as: Component = "div",
  className = "",
  start,
}: RevealTextProps) {
  return <Component className={className} data-start={start}>{children}</Component>;
}
