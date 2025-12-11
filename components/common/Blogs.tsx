import Link from "next/link";
import Image from "next/image";

import { blogs2 } from "@/data/blogs.json";
import BackgroundParallax from "../animation/BackgroundParallax";
import AnimatedButton from "../animation/AnimatedButton";
const defaultDesc = `Inspiring ideas, creative insights, and the latest in design and tech. Fueling innovation for your digital journey.`;
export default function Blogs({
  title = "Recent insights",
  desc = defaultDesc,
}) {
  // Get latest 3 articles
  const latestArticles = blogs2.slice(0, 3);

  return (
    <div className="mxd-section padding-blog">
      <div className="mxd-container grid-container">
        {/* Block - Section Title Start */}
        <div className="mxd-block">
          <div className="mxd-section-title pre-grid">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrtitle">
                    <h2 className="anim-uni-in-up">
                      {title}
                    </h2>
                  </div>
                </div>
                <div className="col-12 col-xl-4 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrdescr">
                    <p className="anim-uni-in-up">{desc}</p>
                  </div>
                </div>
                <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrcontrols anim-uni-in-up">
                    <AnimatedButton
                      text="Todos los artículos"
                      className="btn btn-anim btn-default btn-outline slide-right-up"
                      href={`/blog`}
                    >
                      <i className="ph-bold ph-arrow-up-right" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Section Title End */}
        {/* Block - Blog Preview Cards Start */}
        <div className="mxd-block">
          <div className="mxd-blog-preview">
            <div className="container-fluid p-0">
              <div className="row g-0">
                {latestArticles.map((item, idx) => (
                  <div
                    key={idx}
                    className="col-12 col-xl-4 mxd-blog-preview__item mxd-grid-item animate-card-3"
                  >
                    <Link
                      className="mxd-blog-preview__media"
                      href={`/blog/${item.slug || ''}`}
                    >
                      <div className="mxd-blog-preview__image parallax-img-small" style={{
                        backgroundImage: `url(${item.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }} />
                      <div className="mxd-preview-hover">
                        <i className="mxd-preview-hover__icon">
                          <Image
                            alt="Eye Icon"
                            src="/img/icons/icon-eye.svg"
                            width={38}
                            height={21}
                          />
                        </i>
                      </div>
                      <div className="mxd-blog-preview__tags">
                        {item.categories.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="tag tag-default tag-permanent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>

                    <div className="mxd-blog-preview__data">
                      <Link className="anim-uni-in-up" href={`/blog/${item.slug || ''}`}>
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Block - Blog Preview Cards End */}
      </div>
    </div>
  );
}
