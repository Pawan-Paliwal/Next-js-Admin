"use client"
import { useRef } from "react"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import InfoGraphic from "../../organisms/InfoGraphic"
import WhySliderSec from "@/components/frontendcomponents/organisms/WhySliderSec"
import NetworkFormSec from "@/components/frontendcomponents/organisms/NetworkFormSec"
import Testimonials from "@/components/frontendcomponents/organisms/Testimonials"
import BenefitsSec from "./BenefitsSec"
import "@/uploads/styles/swasth/swasth.css"

export default function SwasthForCorporatesPage({ SlugData }) {
    const data = SlugData?.product
    const sections = SlugData?.sections
    const homeTestimonials = SlugData?.homeTestimonials || []

    if (!data) return null

    const TestimonialData = homeTestimonials.map(item => ({
        id: item.TestimonialID,
        imgSrc: item.TestimonialImage
            ? `/OnlineImages/TestimonialImages/${item.TestimonialImage}`
            : "/assets/images/other/testimony.jpg",
        desc: item.Description,
        name: item.TestimonialName,
        location: item.Location,
    }))

    const hasContent = obj =>
        obj &&
        Object.values(obj).some(v =>
            (Array.isArray(v) && v.length > 0) ||
            (typeof v === "string" && v.trim() !== "")
        )

    const hasTestimonials = TestimonialData.length > 0

    const getMediaPath = f => (f ? `/OnlineImages/ProductImages/${f}` : null)
    const getFileExtension = f => f?.split(".").pop().toLowerCase()

    const section1Data = {
        title: data.Section1Title,
        subtitle: data.Section1Subtitle,
        description: data.Section1Description,
        mediaUrl: getMediaPath(data.Section1MediaUrl),
        buttonText: data.Section1ButtonText,
        isVideo: getFileExtension(data.Section1MediaUrl) === "mp4"
    }

    const section2Data = {
        title: data.Section2Title,
        subtitle: data.Section2Subtitle,
        description: data.Section2Description,
        mediaUrl: getMediaPath(data.Section2MediaUrl),
        buttonText: data.Section2ButtonText
    }

    const section3Data = {
        title: data.Section3Title,
        subtitle: data.Section3Subtitle,
        description: data.Section3Description,
        mediaUrl: getMediaPath(data.Section3MediaUrl),
        buttonText: data.Section3ButtonText,
        items: sections?.section3 || []
    }

    const section4Data = {
        title: data.Section4Title,
        subtitle: data.Section4Subtitle,
        description: data.Section4Description,
        mediaUrl: getMediaPath(data.Section4MediaUrl),
        buttonText: data.Section4ButtonText,
        items: sections?.section4 || []
    }

    const section6Data = {
        title: data.Section6Title,
        subtitle: data.Section6Subtitle,
        description: data.Section6Description,
        formHeading: data.Section6FormHeading
    }

    const benefitsSec = useRef(null)
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
                     {...(section1Data.buttonText ? { btnText: section1Data.buttonText } : {})}
                    mediaSrc={section1Data.mediaUrl}
                    mediaType={section1Data.isVideo ? "video" : "photo"}
                    videoPoster={section1Data.isVideo ? section1Data.mediaUrl?.replace(".mp4", "_poster.png") : null}
                    onClick={() => activeScroll(benefitsSec)}
                />
            )}

            {hasContent(section2Data) && (
                <InfoGraphic
                    classname="corporate"
                    imgSrc={section2Data.mediaUrl}
                    heading={<>{section2Data.title} <span>{section2Data.subtitle}</span></>}
                    desc={section2Data.description}
                    btnText={section2Data.buttonText || "Book a Demo"}
                    onClick={() => activeScroll(networkSec)}
                />
            )}

            {hasContent(section3Data) && <BenefitsSec data={section3Data} ref={benefitsSec} />}

            {hasContent(section4Data) && (
                <WhySliderSec classname="swasth_corporate" data={section4Data} />
            )}

            {hasContent(section6Data) && (
                <NetworkFormSec
                    classname="corporate"
                    heading={<>{section6Data.title} <span>{section6Data.subtitle}</span></>}
                    subHeading={section6Data.description}
                    formHeading={section6Data.formHeading}
                    ref={networkSec}
ProductName={data.ProductName}
                    EnquiryType="Product"
                />
            )}

            {hasTestimonials && (
                <Testimonials
                    classname="products_testimonials"
                    heading={<>Voices of the <span>Swasth Community</span></>}
                    TestimonialData={TestimonialData}
                />
            )}

        </main>
    )
}
