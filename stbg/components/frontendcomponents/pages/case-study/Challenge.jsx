import Image from "next/image"

export default function Challenge({ caseStudy }) {
    const hasData =
        caseStudy?.Section2MediaUrl ||
        caseStudy?.Section2Title ||
        caseStudy?.Section2Subtitle ||
        caseStudy?.Section2Description;

    if (!hasData) return null;

    const imageSrc = caseStudy?.Section2MediaUrl
        ? `/OnlineImages/CasestudiesImages/${caseStudy.Section2MediaUrl}`
        : "/assets/images/case-study/challenge.jpg";

    return (
        <section>
            <div className="challenge_sec sec-pad">
                <div className="container">
                    <div className="main_wrapper">
                        <figure>
                            <Image
                                src={imageSrc}
                                width={530}
                                height={330}
                                alt={caseStudy?.Section2Title || "Challenge Image"}
                            />
                        </figure>

                        <figcaption>
                            {(caseStudy?.Section2Title || caseStudy?.Section2Subtitle) && (
                                <h2>
                                    {caseStudy?.Section2Title}
                                    {caseStudy?.Section2Subtitle && (
                                        <span> {caseStudy.Section2Subtitle}</span>
                                    )}
                                </h2>
                            )}

                            {caseStudy?.Section2Description && (
                                <div
                                    className="desc"
                                    dangerouslySetInnerHTML={{ __html: caseStudy.Section2Description }}
                                />
                            )}
                        </figcaption>
                    </div>
                </div>
            </div>
        </section>
    )
}
