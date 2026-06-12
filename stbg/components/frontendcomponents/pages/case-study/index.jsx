"use client"
import { useRef } from "react"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import Challenge from "./Challenge"
import Solution from "./Solution"
import KeyResults from "./KeyResults"
import NetworkFormSec from "@/components/frontendcomponents/organisms/NetworkFormSec"
import CaseStudies from "@/components/frontendcomponents/organisms/CaseStudies"
import "@/uploads/styles/case-study/case-study.css"

export default function CaseStudyPage({ SlugData, slug }) {
    const caseStudy = SlugData?.caseStudy;
    const moreCaseStudies = SlugData?.moreCaseStudies || [];

    if (!caseStudy) return null;

    const formattedCaseStudies = moreCaseStudies.map((item) => ({
        id: item.CaseStudyId,
        bgImg: item.CaseStudyImage
            ? `/OnlineImages/CasestudiesImages/${item.CaseStudyImage}`
            : "/assets/images/case-study/case-study1.jpg",
        caseHeading: item.CaseStudyName,
        caseDesc: item.CaseStudyDescription,
        caseDetails: [
            {
                id: 1,
                caseDetIcon: item.Box1Media
                    ? `/OnlineImages/CasestudiesImages/${item.Box1Media}`
                    : "/assets/images/case-study/case_det_1.svg",
                caseDetHead: item.Box1Title,
                caseDetDesc: item.Box1Description
            },
            {
                id: 2,
                caseDetIcon: item.Box2Media
                    ? `/OnlineImages/CasestudiesImages/${item.Box2Media}`
                    : "/assets/images/case-study/case_det_2.svg",
                caseDetHead: item.Box2Title,
                caseDetDesc: item.Box2Description
            },
            {
                id: 3,
                caseDetIcon: item.Box3Media
                    ? `/OnlineImages/CasestudiesImages/${item.Box3Media}`
                    : "/assets/images/case-study/case_det_3.svg",
                caseDetHead: item.Box3Title,
                caseDetDesc: item.Box3Description
            },
        ].filter(detail => detail.caseDetDesc),
        linkHref: item.CaseStudyNameURL
            ? `/${item.CaseStudyNameURL}`
            : "/case-study"
    }));

    const heroHeading = caseStudy.Section1Title || caseStudy.CaseStudyName;
    const heroSubtitle = caseStudy.Section1Subtitle || "";
    const heroDescription = caseStudy.Section1Description || caseStudy.CaseStudyDescription;
    const heroButtonText = caseStudy.Section1ButtonText || "Book a demo";
    const heroImage = caseStudy.Section1MediaUrl
        ? `/OnlineImages/CasestudiesImages/${caseStudy.Section1MediaUrl}`
        : caseStudy.CaseStudyImage
            ? `/OnlineImages/CasestudiesImages/${caseStudy.CaseStudyImage}`
            : "/assets/images/case-study/case-study1.jpg";

    const networkSec = useRef(null)
    const activeScroll = (ref) => {
        if (ref.current) {
            const top = ref.current.offsetTop - 110;
            window.scrollTo({
                top,
                behavior: "smooth"
            })
        }
    }

    return (
        <main>
            <ProductHeroSection
                classname="case_study"
                heading={<>{heroHeading} {heroSubtitle && <span>{heroSubtitle}</span>}</>}
                subHeading={heroDescription}
                btnText={heroButtonText}
                mediaType="photo"
                mediaSrc={heroImage}
                onClick={() => activeScroll(networkSec)}
            />

            <Challenge caseStudy={caseStudy} />

            <Solution caseStudy={caseStudy} />

            <KeyResults caseStudy={caseStudy} />

            <NetworkFormSec
                classname="case_study"
                heading={<>Experience the <span>impact</span></>}
                subHeading="Book a free demo and see how Swasth drives measurable results."
                formHeading=" Book Now"
                ref={networkSec}
                EnquiryType="Case Study"
            />

            {formattedCaseStudies.length > 0 && (
                <CaseStudies
                    classname="case_page"
                    secHeading={<>More <span>Case Studies</span></>}
                    caseStudyData={formattedCaseStudies}
                />
            )}
        </main>
    )
}
