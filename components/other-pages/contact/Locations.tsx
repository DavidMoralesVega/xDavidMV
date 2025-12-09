export default function Locations() {
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container grid-container">
        {/* Block - Text Block with H2 Title, Paragraph and Contact Lists Start */}
        <div className="mxd-block">
          <div className="container-fluid px-0">
            <div className="row gx-0">
              <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                <div className="mxd-block__name">
                  <h2 className="reveal-type anim-uni-in-up">
                    Welcome to our office
                  </h2>
                </div>
              </div>
              <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                <div className="mxd-block__content">
                  <div className="mxd-block__paragraph">
                    <p className="t-large t-bright anim-uni-in-up">
                      Inspiring ideas, creative insights, and the latest in
                      design and tech. Fueling innovation for your digital
                      journey.
                    </p>
                    <div className="mxd-paragraph__lists">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-12 col-md-6 col-xl-5 mxd-paragraph__lists-item">
                            <div className="mxd-paragraph__lists-title">
                              <p className="t-large t-bright t-caption anim-uni-in-up">
                                New York
                              </p>
                            </div>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a
                                  className="anim-uni-in-up"
                                  href="https://goo.gl/maps/nWXKpGaDPuyH6gxRA"
                                  target="_blank"
                                >
                                  11 West 53 Street,
                                  <br />
                                  New York, NY
                                  <br />
                                  10019
                                </a>
                              </li>
                            </ul>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a href="tel:+12127089400">+1 212-708-9400</a>
                              </li>
                              <li className="anim-uni-in-up">
                                <a href="mailto:example@example.com?subject=Message%20from%20your%20site">
                                  hello@rayo.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="col-12 col-md-6 col-xl-5 mxd-paragraph__lists-item">
                            <div className="mxd-paragraph__lists-title">
                              <p className="t-large t-bright t-caption anim-uni-in-up">
                                Oakland
                              </p>
                            </div>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a
                                  href="https://goo.gl/maps/xap5o3MZBuC6DFHz8"
                                  target="_blank"
                                >
                                  3400 Broadway,
                                  <br />
                                  Oakland, CA
                                  <br />
                                  94611
                                </a>
                              </li>
                            </ul>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a href="tel:+15104570211">+1 510-457-0211</a>
                              </li>
                              <li className="anim-uni-in-up">
                                <a href="mailto:example@example.com?subject=Message%20from%20your%20site">
                                  hello@rayo.com
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Text Block with H2 Title, Paragraph and Contact Lists End */}
      </div>
    </div>
  );
}
