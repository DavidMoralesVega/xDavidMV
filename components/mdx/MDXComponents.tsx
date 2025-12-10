import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "./CodeBlock";
import { CodeTabs, CodeBlockEnhanced } from "./CodeTabs";
import { Callout } from "./Callout";

// Custom components for MDX
export const mdxComponents: MDXComponents = {
  // Override default elements
  h1: ({ children }) => <h1 className="article-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="article-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="article-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="article-h4">{children}</h4>,
  h5: ({ children }) => <h5 className="article-h5">{children}</h5>,
  h6: ({ children }) => <h6 className="article-h6">{children}</h6>,

  p: ({ children }) => <p>{children}</p>,

  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <Link href={href || "#"}>{children}</Link>;
  },

  ul: ({ children }) => <ul className="article-ul">{children}</ul>,
  ol: ({ children }) => <ol className="article-ol">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,

  blockquote: ({ children }) => (
    <div className="mxd-article__block block-quote">
      <blockquote>{children}</blockquote>
    </div>
  ),

  // Code blocks - rehype-pretty-code wraps in figure > pre > code
  pre: ({ children, ...props }) => {
    // Extract data attributes from rehype-pretty-code
    const dataLanguage = (props as Record<string, unknown>)["data-language"];
    const dataTheme = (props as Record<string, unknown>)["data-theme"];

    return (
      <CodeBlock
        className={`language-${dataLanguage || "plaintext"}`}
        title={dataLanguage as string}
        {...props}
      >
        {children}
      </CodeBlock>
    );
  },

  code: ({ children, className }) => {
    // Inline code (not inside pre)
    if (!className) {
      return <code className="inline-code">{children}</code>;
    }
    // Code inside pre block
    return <code className={className}>{children}</code>;
  },

  // Images
  img: ({ src, alt, width, height }) => {
    if (!src) return null;

    // Handle relative paths
    const imageSrc = src.startsWith("/") ? src : `/${src}`;

    return (
      <span className="article-image">
        <Image
          src={imageSrc}
          alt={alt || ""}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="rounded-lg"
        />
        {alt && <span className="article-image-caption">{alt}</span>}
      </span>
    );
  },

  // Tables
  table: ({ children }) => (
    <div className="article-table-wrapper">
      <table className="article-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,

  // Horizontal rule
  hr: () => <hr className="article-hr" />,

  // Strong and emphasis
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,

  // Custom components available in MDX
  Callout,
  CodeTabs,
  CodeBlockEnhanced,
  Image: ({
    src,
    alt,
    width = 800,
    height = 450,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) => (
    <span className="article-image">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg"
      />
    </span>
  ),
};
