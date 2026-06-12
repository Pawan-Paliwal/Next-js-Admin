import Image from "next/image";

export default function MissionVission(){
    return(
        <section>
            <div className="mission_sec sec-pad">
                <div className="container">
                    <div className="heading">
                        <p>Guiding Principles: </p>
                        <h2>The <span>Vision</span> and <span>Mission</span> Transforming Healthcare Ecosystem</h2>
                    </div>
                    <div className="mission_wrapper flex">
                        <div className="mission_col">
                            <div className="upper_sec">
                                <div className="head">
                                    <h3>Our Mission</h3>
                                    <h6>Bridging the Gap Between Healthcare and Affordability</h6>
                                </div>
                                <div className="icon">
                                    <Image src="/assets/images/about/mission.svg" width="62" height="62" alt="Mission Icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>The core objective is to leverage financial intelligence to provide predictable access to quality care. By ensuring that complex finance and operational issues do not interfere with patient care, this principle guides all efforts involving both families and trusted hospital partners.</p>
                            </div>
                        </div>
                        <div className="mission_col">
                            <div className="upper_sec">
                                <div className="head">
                                    <h3>Our Vision</h3>
                                    <h6>Building India's Most Trusted Healthcare Ecosystem</h6>
                                </div>
                                <div className="icon">
                                    <Image src="/assets/images/about/vision.svg" width="62" height="62" alt="Vision Icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>The goal is to build India's most trusted ecosystem for health and wellness. By continuing to innovate and democratize financial solutions, the organization aims to redefine the healthcare value chain and achieve sustainable growth as a leader in the Indian healthcare sector.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}