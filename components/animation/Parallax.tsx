"use client";

import React from "react";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export default function Parallax({ children, className = "" }: ParallaxProps) {
  return <div className={className}>{children}</div>;
}
