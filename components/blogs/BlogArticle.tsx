
import Link from "next/link";
import type { BlogPostWithMDX } from "@/lib/blog";

interface BlogArticleProps {
  post: BlogPostWithMDX;
}

const StarSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 20 20">
    <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
  </svg>
);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function BlogArticle({ post }: BlogArticleProps) {
  const { frontmatter, readingTime, content } = post;

  return (
    <div className="mxd-section padding-pre-title">
      <div className="mxd-container grid-container">
        <div className="mxd-article-area loading-wrap">
          {/* Article Container Start */}
          <div className="mxd-article-container mxd-grid-item no-margin">
            {/* Article Start */}
            <article className="mxd-article">
              {/* Article Headline Start */}
              <div className="mxd-article__headline">
                <div className="mxd-article__meta">
                  <div className="mxd-article__breadcrumbs loading__item">
                    <span>
                      <Link href="/">Inicio</Link>
                    </span>
                    <span>
                      <Link href="/blog">Publicaciones</Link>
                    </span>
                    <span className="current-item">
                      {frontmatter.title.length > 50
                        ? `${frontmatter.title.substring(0, 50)}...`
                        : frontmatter.title}
                    </span>
                  </div>
                  <div className="mxd-article__data loading__item">
                    <span className="meta-date">
                      {formatDate(frontmatter.date)}
                      <StarSvg />
                    </span>
                    <span className="meta-time">{readingTime}</span>
                  </div>
                </div>
                <div className="mxd-article__title loading__item">
                  <h1 className="h1-small">{frontmatter.title}</h1>
                </div>
                <div className="mxd-article__tags loading__item">
                  {frontmatter.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="tag tag-default tag-outline tag-link-outline"
                    >
                      <Link href="/">{tag}</Link>
                    </span>
                  ))}
                </div>
              </div>
              {/* Article Headline End */}

              {/* Article Thumb Start */}
              <div className="mxd-article__thumb loading__fade">
                <img
                  alt={frontmatter.imageAlt || frontmatter.title}
                  src={frontmatter.image}
                  width="1920"
                  height="1280"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
              {/* Article Thumb End */}

              {/* Article Content Start */}
              <div className="mxd-article__content">
                <div className="mxd-article__block">
                  {content}
                </div>
              </div>
              {/* Article Content End */}
            </article>
            {/* Article End */}

            {/* Article Author Start */}
            <div className="mxd-article-author">
              <div className="mxd-article-author__data">
                <Link className="mxd-article-author__avatar" href="/">
                  <img
  src="/images/brand/DavidMV.webp"
  alt="David Morales Vega"
  width="300"
  height="300"
  loading="lazy"
/>
                </Link>
                <div className="mxd-article-author__info">
                  <h5 className="mxd-article-author__name">
                    <Link href="/">David Morales Vega</Link>
                    <small className="mxd-article-author__position">
                      Solutions Architect & Tech Lead
                    </small>
                  </h5>
                  <div className="mxd-article-author__socials">
                    <span className="tag tag-default tag-opposite tag-link-opposite">
                      <a
                        href="https://www.linkedin.com/in/morales-vega-david/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </span>
                    <span className="tag tag-default tag-opposite tag-link-opposite">
                      <a
                        href="https://github.com/DavidMoralesVega"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mxd-article-author__quote">
                <p>
                  Arquitecto de Soluciones y Technical Lead con 7+ años de
                  experiencia en el diseño de ecosistemas digitales escalables y
                  microservicios. Perfil híbrido único con doble titulación
                  (Ingeniería de Sistemas + Derecho), especializado en alinear
                  estrategia de negocio, cumplimiento normativo y tecnología.
                  Docente universitario y conferencista comprometido con la
                  innovación tecnológica.
                </p>
              </div>
            </div>
            {/* Article Author End */}
          </div>
          {/* Article Container End */}
        </div>
      </div>
    </div>
  );
}
