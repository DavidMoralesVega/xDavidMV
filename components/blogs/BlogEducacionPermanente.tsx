import Image from "next/image";
import Link from "next/link";

export default function BlogEducacionPermanente() {
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
                      <Link href={`/`}>Inicio</Link>
                    </span>
                    <span>
                      <Link href={`/blog-standard`}>Publicaciones</Link>
                    </span>
                    <span className="current-item">
                      Bolivia ante el reto de la educación permanente
                    </span>
                  </div>
                  <div className="mxd-article__data loading__item">
                    <span className="meta-date">
                      Mayo 2025
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        viewBox="0 0 20 20"
                      >
                        <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
                      </svg>
                    </span>
                    <span className="meta-time">8 min. de lectura</span>
                  </div>
                </div>
                <div className="mxd-article__title loading__item">
                  <h1 className="h1-small">
                    Bolivia ante el reto de la educación permanente
                  </h1>
                </div>
                <div className="mxd-article__tags loading__item">
                  <span className="tag tag-default tag-outline tag-link-outline">
                    <Link href={`/`}>Educación</Link>
                  </span>
                  <span className="tag tag-default tag-outline tag-link-outline">
                    <Link href={`/`}>SENAPI</Link>
                  </span>
                  <span className="tag tag-default tag-outline tag-link-outline">
                    <Link href={`/`}>Revista Renacer</Link>
                  </span>
                </div>
              </div>
              {/* Article Headline End */}

              {/* Article Thumb Start */}
              <div className="mxd-article__thumb loading__fade">
                <Image
                  alt="Bolivia ante el reto de la educación permanente"
                  src="/img/blog/article/education-bolivia.png"
                  width={1920}
                  height={1280}
                />
              </div>
              {/* Article Thumb End */}

              {/* Article Content Start */}
              <div className="mxd-article__content">
                <div className="mxd-article__block">
                  <h3>Introducción</h3>
                  <p>
                    En un mundo donde la tecnología evoluciona exponencialmente,
                    Bolivia enfrenta el desafío de adaptarse a la era digital.
                    Los avances tecnológicos transforman el mercado laboral,
                    haciendo que la educación tradicional resulte insuficiente
                    para preparar a nuestra población de cara al futuro. La
                    pandemia puso de relieve que nuestro sistema educativo no
                    fomenta el aprendizaje continuo: en la evaluación PISA 2018,
                    menos del 10 % de los estudiantes de América Latina alcanzó
                    el nivel 4 de competencia en matemáticas, lectura y
                    ciencias, un umbral esencial para resolver problemas
                    complejos en contextos reales.
                  </p>
                </div>

                <div className="mxd-article__block">
                  <h3>Retos de la era digital</h3>
                  <p>
                    El conocimiento deja de ser un activo estático y caduca con
                    rapidez. Un título universitario, que antes garantizaba
                    estabilidad durante décadas, ahora representa apenas un
                    punto de partida: la adopción masiva de tecnologías
                    digitales como el teletrabajo, plataformas de aprendizaje en
                    línea y herramientas de inteligencia artificial, exige una
                    reconversión constante de competencias. Al mismo tiempo,
                    Bolivia debe consolidar una cultura de aprendizaje continuo,
                    donde cada profesional asuma la responsabilidad de
                    actualizar sus habilidades y el sistema educativo facilite
                    trayectorias de formación a lo largo de toda la vida.
                  </p>
                </div>

                <div className="mxd-article__block">
                  <h3>
                    Hacia un ecosistema integrado de aprendizaje permanente
                  </h3>
                  <p>
                    Para que esta cultura se arraigue en todos los sectores, se
                    propone un conjunto de medidas generales, aplicables tanto a
                    la industria, el comercio y los servicios, como a la
                    agricultura, la salud y la administración pública:
                  </p>
                </div>

                <div className="mxd-article__block">
                  <h5>1. Plataforma nacional de aprendizaje continuo</h5>
                  <p>
                    Un portal único que reúna cursos, talleres y recursos
                    abiertos, con rutas de aprendizaje flexibles y
                    reconocimiento de competencias adquiridas en ámbitos
                    formales e informales.
                  </p>

                  <h5>2. Red de mentores y comunidades de práctica</h5>
                  <p>
                    Conectar a expertos de distintas disciplinas con aprendices,
                    fomentando el intercambio de experiencias y proyectos
                    colaborativos que respondan a necesidades reales de cada
                    sector.
                  </p>

                  <h5>3. Iniciativas de formación dual</h5>
                  <p>
                    Combinar la formación teórica con prácticas en
                    organizaciones de cualquier ámbito, de modo que los
                    participantes adquieran tanto conocimientos como experiencia
                    laboral efectiva.
                  </p>

                  <h5>4. Marco nacional de competencias transversales</h5>
                  <p>
                    Definir y certificar habilidades clave, como pensamiento
                    crítico, resolución de problemas, comunicación y trabajo en
                    equipo, que sean válidas para todas las profesiones y
                    actividades.
                  </p>

                  <h5>5. Incentivos para la actualización profesional</h5>
                  <p>
                    Establecer beneficios fiscales o subvenciones para empresas
                    y personas que participen en programas de formación
                    continua, promoviendo una economía del conocimiento
                    inclusiva.
                  </p>

                  <p>
                    Estas acciones, coordinadas desde un plan estratégico de
                    largo plazo, garantizarán un flujo constante de talento
                    versátil, capaz de adaptarse y prosperar en un entorno en
                    permanente transformación.
                  </p>
                </div>

                <div className="mxd-article__block block-quote">
                  <blockquote>
                    <p className="quote__text">
                      La verdadera alfabetización del siglo XXI radica en la
                      capacidad de aprender, desaprender y reaprender sin pausa.
                    </p>
                    <p className="quote__cite">
                      <cite>David Morales Vega</cite>
                    </p>
                  </blockquote>
                </div>

                <div className="mxd-article__block">
                  <h3>Conclusiones</h3>
                  <p>
                    La verdadera alfabetización del siglo XXI radica en la
                    capacidad de aprender, desaprender y reaprender sin pausa.
                    Bolivia debe evolucionar de un modelo educativo basado en la
                    memorización hacia uno centrado en la adaptabilidad, el
                    pensamiento crítico y la colaboración multisectorial. Solo
                    así nuestra sociedad estará preparada para enfrentar con
                    éxito los retos de la era digital.
                  </p>
                </div>

                <div className="mxd-article__block">
                  <h3>Referencias</h3>
                  <ol className="article-ol">
                    <li>
                      OECD. (2019). Resultados de PISA 2018 (Volumen I): Lo que
                      los estudiantes saben y pueden hacer. París: Publicaciones
                      de la OCDE.
                    </li>
                    <li>
                      Azuara Herrera, O., et al. (2020). El futuro del trabajo
                      en América Latina y el Caribe: tecnología y recuperación
                      tras el COVID-19. Banco Interamericano de Desarrollo
                      (BID).
                    </li>
                    <li>
                      OpenAI. (2023). Los GPT son GPT: Una mirada temprana al
                      impacto potencial de los modelos de lenguaje de gran
                      escala en el mercado laboral.
                    </li>
                  </ol>
                </div>

                <div className="mxd-article__block">
                  <p
                    className="t-small"
                    style={{ fontStyle: "italic", marginTop: "2rem" }}
                  >
                    <strong>Publicación registrada:</strong> Revista Educativa
                    Renacer (1.ª Edición) - Mayo 2025
                    <br />
                    Obra registrada oficialmente bajo la Resolución
                    Administrativa Nro. 1-1457/2025 del Servicio Nacional de
                    Propiedad Intelectual (SENAPI), cumpliendo con la normativa
                    de Derecho de Autor vigente.
                  </p>
                </div>
              </div>
              {/* Article Content End */}
            </article>
            {/* Article End */}

            {/* Article Author Start */}
            <div className="mxd-article-author">
              <div className="mxd-article-author__data">
                <a className="mxd-article-author__avatar" href="#">
                  <Image
                    alt="David Morales Vega"
                    src="/img/brand/DavidMV.png"
                    width={300}
                    height={300}
                  />
                </a>
                <div className="mxd-article-author__info">
                  <h5 className="mxd-article-author__name">
                    <a href="#">David Morales Vega</a>
                    <small className="mxd-article-author__position">
                      Solutions Architect & Tech Lead
                    </small>
                  </h5>
                  <div className="mxd-article-author__socials">
                    <span className="tag tag-default tag-opposite tag-link-opposite">
                      <a
                        href="https://www.linkedin.com/in/morales-vega-david/"
                        target="_blank"
                      >
                        LinkedIn
                      </a>
                    </span>
                    <span className="tag tag-default tag-opposite tag-link-opposite">
                      <a
                        href="https://github.com/DavidMoralesVega"
                        target="_blank"
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
