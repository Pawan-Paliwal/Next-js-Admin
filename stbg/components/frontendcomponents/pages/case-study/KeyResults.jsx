import Image from "next/image";

export default function KeyResults({ caseStudy }) {

    const hasData =
        caseStudy?.Section4Title ||
        caseStudy?.Section4Description;

    if (!hasData) return null;

    const renderBox = (title, desc, media) => {
        if (!title && !desc && !media) return null;

        return (
            <div className="info_col">
                {media && (
                    <div className="icon">
                        <Image
                            src={`/OnlineImages/CasestudiesImages/${media}`}
                            width={40}
                            height={40}
                            alt={title || "Icon"}
                        />
                    </div>
                )}
                {/* {title && <h6 className="count">{title}</h6>} */}
                {desc && <p>{desc}</p>}
            </div>
        );
    };


    return (
        <section>
            <div className="key_results sec-pad">
                <div className="container">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="heading">
                                {(caseStudy?.Section4Title || caseStudy?.Section4Subtitle) && (
                                    <h2>
                                        {caseStudy?.Section4Title}
                                        {caseStudy?.Section4Subtitle && (
                                            <span> {caseStudy.Section4Subtitle}</span>
                                        )}
                                    </h2>
                                )}
                                {caseStudy?.Section4Description && (
                                    <div className="desc" 
                                        dangerouslySetInnerHTML={{ __html: caseStudy.Section4Description }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="colB">
                            <div className="info_wrap">
                                {renderBox(caseStudy.Box1Title, caseStudy.Box1Description, caseStudy.Box1Media)}
                                {renderBox(caseStudy.Box2Title, caseStudy.Box2Description, caseStudy.Box2Media)}
                                {renderBox(caseStudy.Box3Title, caseStudy.Box3Description, caseStudy.Box3Media)}
                            </div>
                        </div>

                        {caseStudy?.Section4MediaUrl && (
                            <figure className="logo-vector">
                                <Image
                                    src={`/OnlineImages/CasestudiesImages/${caseStudy.Section4MediaUrl}`}
                                    width={100}
                                    height={80}
                                    alt="Logo Vector"
                                />
                            </figure>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

