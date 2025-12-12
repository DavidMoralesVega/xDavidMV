"use client";

interface TypedTextProps {
  strings?: string[];
  className?: string;
}

export default function TypedText({ strings = [], className = "" }: TypedTextProps) {
  return <span className={className}>{strings[0] || ""}</span>;
}
