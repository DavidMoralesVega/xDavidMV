"use client";

import React from "react";

interface StackCardsProps {
  children: React.ReactNode;
  className?: string;
  stackName?: string;
}

export default function StackCards({ children, className = "", stackName }: StackCardsProps) {
  return <div className={className} data-stack-name={stackName}>{children}</div>;
}
