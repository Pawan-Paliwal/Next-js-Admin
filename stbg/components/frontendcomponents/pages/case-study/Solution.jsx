import Image from "next/image"

export default function Solution({ caseStudy }) {

    const hasData =
        caseStudy?.Section3Title ||
        caseStudy?.Section3Subtitle ||
        caseStudy?.Section3Description ||
        caseStudy?.Section3MediaUrl;

    if (!hasData) return null;

    const imageSrc = caseStudy?.Section3MediaUrl
        ? `/OnlineImages/CasestudiesImages/${caseStudy.Section3MediaUrl}`
        : "/assets/images/case-study/solution.jpg";

    return (
        <section>
            <div className="solution_sec sec-pad">
                <div className="container">
                    <div className="main_wrapper">
                        <figcaption>
                            {(caseStudy?.Section3Title || caseStudy?.Section3Subtitle) && (
                                <h2>
                                    {caseStudy?.Section3Title}
                                    {caseStudy?.Section3Subtitle && (
                                        <span> {caseStudy.Section3Subtitle}</span>
                                    )}
                                </h2>
                            )}
                            {caseStudy?.Section3Description && (
                                <div className="desc"
                                    dangerouslySetInnerHTML={{ __html: caseStudy.Section3Description }}
                                />
                            )}
                        </figcaption>
                        <figure>
                            <Image
                                src={imageSrc}
                                width={530}
                                height={330}
                                alt={caseStudy?.Section3Title || "Solution Image"}
                            />
                        </figure>

                    </div>
                </div>
            </div>
        </section>
    )
}
