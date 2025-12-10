"use client";

import { useRef } from "react";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  const getCodeText = (): string => {
    if (preRef.current) {
      return preRef.current.textContent || "";
    }
    return "";
  };

  return (
    <div className="code-block-wrapper">
      {title && (
        <div className="code-block-header">
          <span className="code-block-title">{title}</span>
        </div>
      )}
      <div className="code-block-container">
        <CopyButton text={getCodeText()} />
        <pre ref={preRef} className={className}>
          {children}
        </pre>
      </div>
    </div>
  );
}
