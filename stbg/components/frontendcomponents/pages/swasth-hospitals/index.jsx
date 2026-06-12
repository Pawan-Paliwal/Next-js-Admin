"use client"
import { useRef } from "react"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import InfoGraphic from "../../organisms/InfoGraphic"
import WhySliderSec from "@/components/frontendcomponents/organisms/WhySliderSec"
import NetworkFormSec from "@/components/frontendcomponents/organisms/NetworkFormSec"
import Testimonials from "@/components/frontendcomponents/organisms/Testimonials"
import ValueAddons from "./ValueAddons"
import OperationalFlow from "./OperationalFlow"
import CaseStudies from "../../organisms/CaseStudies"
import "@/uploads/styles/swasth/swasth.css"

export default function SwasthForHospitalsPage({ SlugData }) {
    const data = SlugData?.product
    const sections = SlugData?.sections
    const homeTestimonials = SlugData?.homeTestimonials || []
    const caseStudies = data?.caseStudies || []

    if (!data) return null

 if (data.ComingSoon === 1) {
        return (
            <main className="coming-soon-container">
                <div className="coming-soon-content">
                    <h1>Coming Soon</h1>
                    <p>This product is currently under development. Stay tuned for updates!</p>
                </div>
                <style jsx>{`
                    .coming-soon-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 70vh;
                        padding: 2rem;
                    }
                    .coming-soon-content {
                        text-align: center;
                        max-width: 600px;
                    }
                    .coming-soon-content h1 {
                        font-size: 3rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                        color: #333;
                    }
                    .coming-soon-content p {
                        font-size: 1.25rem;
                        color: #666;
                    }
                `}</style>
            </main>
        )
    }

    const TestimonialData = homeTestimonials.map(item => ({
        id: item.TestimonialID,
        imgSrc: item.TestimonialImage
            ? `/OnlineImages/TestimonialImages/${item.TestimonialImage}`
            : "/assets/images/other/testimony.jpg",
        desc: item.Description,
        name: item.TestimonialName,
        location: item.Location,
    }))

       const caseStudyData = caseStudies.map(item => ({
        id: item.CaseStudyId,
        bgImg: item.CaseStudyImage
            ? `/OnlineImages/CasestudiesImages/${item.CaseStudyImage}`
            : "/assets/images/case-study/case-study1.jpg",
        caseHeading: item.CaseStudyName,
        caseDesc: item.CaseStudyDescription,
        caseDetails: [
            { id: 1, caseDetIcon: item.Box1Media ? `/OnlineImages/CasestudiesImages/${item.Box1Media}` : "/assets/images/case-study/case_det_1.svg", caseDetHead: item.Box1Title, caseDetDesc: item.Box1Description },
            { id: 2, caseDetIcon: item.Box2Media ? `/OnlineImages/CasestudiesImages/${item.Box2Media}` : "/assets/images/case-study/case_det_2.svg", caseDetHead: item.Box2Title, caseDetDesc: item.Box2Description },
            { id: 3, caseDetIcon: item.Box3Media ? `/OnlineImages/CasestudiesImages/${item.Box3Media}` : "/assets/images/case-study/case_det_3.svg", caseDetHead: item.Box3Title, caseDetDesc: item.Box3Description },
        ].filter(detail => detail.caseDetDesc),
        linkHref: item.CaseStudyNameURL ? `/${item.CaseStudyNameURL}` : "/case-study"
    }))

    const getMediaPath = f => (f ? `/OnlineImages/ProductImages/${f}` : null)
    const getFileExtension = f => f?.split(".").pop().toLowerCase()
    const hasContent = obj => obj && Object.values(obj).some(v => (Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : !!v))
    const hasTestimonials = TestimonialData.length > 0
    const hasCaseStudies = caseStudyData.length > 0

    const section1Data = { title: data.Section1Title, subtitle: data.Section1Subtitle, description: data.Section1Description, mediaUrl: getMediaPath(data.Section1MediaUrl), buttonText: data.Section1ButtonText, isVideo: getFileExtension(data.Section1MediaUrl) === "mp4" }
    const section2Data = { title: data.Section2Title, subtitle: data.Section2Subtitle, description: data.Section2Description, mediaUrl: getMediaPath(data.Section2MediaUrl), buttonText: data.Section2ButtonText }
    const section3Data = { title: data.Section3Title, subtitle: data.Section3Subtitle, description: data.Section3Description, mediaUrl: getMediaPath(data.Section3MediaUrl), buttonText: data.Section3ButtonText, items: sections?.section3 || [] }
    const section4Data = { title: data.Section4Title, subtitle: data.Section4Subtitle, description: data.Section4Description, mediaUrl: getMediaPath(data.Section4MediaUrl), buttonText: data.Section4ButtonText, items: sections?.section4 || [] }
    const section5Data = { title: data.Section5Title, subtitle: data.Section5Subtitle, description: data.Section5Description, mediaUrl: getMediaPath(data.Section5MediaUrl), buttonText: data.Section5ButtonText, items: sections?.section5 || [] }
    const section6Data = { title: data.Section6Title, subtitle: data.Section6Subtitle, description: data.Section6Description, formHeading: data.Section6FormHeading }

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

            {hasContent(section1Data) && (
                <ProductHeroSection
                    heading={<>{section1Data.title}<span> {section1Data.subtitle}</span></>}
                    subHeading={section1Data.description}
                    mediaSrc={section1Data.mediaUrl}
                    mediaType={section1Data.isVideo ? "video" : "photo"}
                    videoPoster={section1Data.isVideo ? section1Data.mediaUrl?.replace(".mp4", "_poster.png") : null}
                    {...(section1Data.buttonText ? { btnText: section1Data.buttonText } : {})}
                    onClick={() => activeScroll(networkSec)}
                />
            )}

            {hasContent(section2Data) && <InfoGraphic classname="hospital" imgSrc={section2Data.mediaUrl} heading={<>{section2Data.title} <span>{section2Data.subtitle}</span></>} desc={section2Data.description} />}

            {hasContent(section3Data) && <OperationalFlow data={section3Data} />}

            {hasContent(section4Data) && <WhySliderSec classname="hospital" data={section4Data} />}

            {hasContent(section5Data) && <ValueAddons data={section5Data} onClick={() => activeScroll(networkSec)} />}

            {hasContent(section6Data) && (
                <NetworkFormSec
                    classname="hospital"
                    heading={<>{section6Data.title} <span>{section6Data.subtitle}</span></>}
                    subHeading={section6Data.description}
                    formHeading={section6Data.formHeading || "Book a Demo"}
                    ref={networkSec}
 ProductName={data.ProductName}
                    EnquiryType="Product"
                />
            )}

            {hasCaseStudies && <CaseStudies secHeading={<><span>Case Studies</span></>} caseStudyData={caseStudyData} />}

            {hasTestimonials && <Testimonials classname="products_testimonials" heading={<>Voices of the <span>Swasth Community</span></>} TestimonialData={TestimonialData} />}

        </main>
    )
}
