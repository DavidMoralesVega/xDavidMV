"use client";

import { useState, useRef, useEffect } from "react";
import { CopyButton } from "./CopyButton";

interface CodeTab {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  defaultTab?: number;
}

// Language icons/labels mapping
const languageLabels: Record<string, string> = {
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  tsx: "TSX",
  python: "Python",
  py: "Python",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Zsh",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sql: "SQL",
  graphql: "GraphQL",
  gql: "GraphQL",
  rust: "Rust",
  go: "Go",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  csharp: "C#",
  cs: "C#",
  cpp: "C++",
  c: "C",
  php: "PHP",
  ruby: "Ruby",
  rb: "Ruby",
  dart: "Dart",
  dockerfile: "Dockerfile",
  docker: "Docker",
  nginx: "Nginx",
  xml: "XML",
  markdown: "Markdown",
  md: "Markdown",
  plaintext: "Text",
  text: "Text",
};

const getLanguageLabel = (lang: string): string => {
  return languageLabels[lang.toLowerCase()] || lang.toUpperCase();
};

export function CodeTabs({ tabs, defaultTab = 0 }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [highlightedCode, setHighlightedCode] = useState<string[]>([]);
  const codeRefs = useRef<(HTMLPreElement | null)[]>([]);

  // Get the current code text for copy functionality
  const getCurrentCodeText = (): string => {
    return tabs[activeTab]?.code || "";
  };

  return (
    <div className="code-tabs-wrapper">
      {/* Tabs Header */}
      <div className="code-tabs-header">
        <div className="code-tabs-list">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`code-tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
              type="button"
            >
              <span className="code-tab-label">
                {tab.label || getLanguageLabel(tab.language)}
              </span>
            </button>
          ))}
        </div>
        <CopyButton text={getCurrentCodeText()} />
      </div>

      {/* Tab Panels */}
      <div className="code-tabs-panels">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`code-tab-panel ${activeTab === index ? "active" : ""}`}
            role="tabpanel"
            hidden={activeTab !== index}
          >
            <pre
              ref={(el) => { codeRefs.current[index] = el; }}
              className={`language-${tab.language}`}
              data-language={tab.language}
            >
              <code className={`language-${tab.language}`}>
                {tab.code}
              </code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single code block with filename/title and copy
interface CodeBlockWithHeaderProps {
  children: React.ReactNode;
  language?: string;
  filename?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export function CodeBlockEnhanced({
  children,
  language = "plaintext",
  filename,
  title,
  showLineNumbers = false,
  highlightLines = [],
}: CodeBlockWithHeaderProps) {
  const preRef = useRef<HTMLPreElement>(null);

  const getCodeText = (): string => {
    if (preRef.current) {
      return preRef.current.textContent || "";
    }
    return "";
  };

  const displayTitle = filename || title || getLanguageLabel(language);

  return (
    <div className="code-block-enhanced">
      <div className="code-block-header">
        <div className="code-block-header-left">
          {filename && (
            <span className="code-block-filename">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {filename}
            </span>
          )}
          {!filename && title && (
            <span className="code-block-title">{title}</span>
          )}
          {!filename && !title && (
            <span className="code-block-language">{getLanguageLabel(language)}</span>
          )}
        </div>
        <CopyButton text={getCodeText()} />
      </div>
      <div className="code-block-body">
        <pre
          ref={preRef}
          className={`language-${language} ${showLineNumbers ? "line-numbers" : ""}`}
          data-language={language}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
