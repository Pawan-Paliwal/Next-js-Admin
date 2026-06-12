"use client"
import { useRef, useCallback } from "react"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import InfoGraphic from "../../organisms/InfoGraphic"
import WhySliderSec from "@/components/frontendcomponents/organisms/WhySliderSec"
import NetworkFormSec from "@/components/frontendcomponents/organisms/NetworkFormSec"
import Testimonials from "@/components/frontendcomponents/organisms/Testimonials"
import HowItWorks from "./HowItWorks"
import "@/uploads/styles/swasth/swasth.css"

export default function ProcalyxPharmaPage({ SlugData }) {
    const networkSec = useRef(null)
    const product = SlugData?.product
    const sections = SlugData?.sections || {}
    const homeTestimonials = SlugData?.homeTestimonials || []

    if (!product) return null

    const getMediaPath = f => f ? `/OnlineImages/ProductImages/${f}` : null
    const getFileExtension = f => f ? f.split(".").pop().toLowerCase() : ""
    const hasContent = obj => obj && Object.values(obj).some(v => (Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : !!v))
    const hasTestimonials = homeTestimonials.length > 0

    const TestimonialData = homeTestimonials.map(item => ({
        id: item.TestimonialID,
        imgSrc: item.TestimonialImage
            ? `/OnlineImages/TestimonialImages/${item.TestimonialImage}`
            : "/assets/images/other/testimony.jpg",
        desc: item.Description,
        name: item.TestimonialName,
        location: item.Location,
    }))

    const section1Data = {
        title: product.Section1Title,
        subtitle: product.Section1Subtitle,
        description: product.Section1Description,
        mediaUrl: getMediaPath(product.Section1MediaUrl),
        buttonText: product.Section1ButtonText,
        isVideo: ["mp4", "webm", "ogg", "mov"].includes(getFileExtension(product.Section1MediaUrl))
    }

    const section2Data = {
        title: product.Section2Title,
        subtitle: product.Section2Subtitle,
        description: product.Section2Description,
        mediaUrl: getMediaPath(product.Section2MediaUrl),
        buttonText: product.Section2ButtonText
    }

    const section3Data = {
        title: product.Section3Title,
        subtitle: product.Section3Subtitle,
        description: product.Section3Description,
        mediaUrl: getMediaPath(product.Section3MediaUrl),
        buttonText: product.Section3ButtonText,
        items: (sections.section3 || []).map(item => ({
            id: item.ItemId,
            title: item.ItemTitle,
            description: item.ItemDescription,
            iconUrl: item.ItemIconUrl ? `/OnlineImages/ProductImages/${item.ItemIconUrl}` : null,
            displayOrder: item.DisplayOrder
        }))
    }

    const section4Data = {
        title: product.Section4Title,
        subtitle: product.Section4Subtitle,
        description: product.Section4Description,
        mediaUrl: getMediaPath(product.Section4MediaUrl),
        buttonText: product.Section4ButtonText,
        items: (sections.section4 || []).map(item => ({
            id: item.ItemId,
            iconSrc: item.ItemIconUrl
                ? `/OnlineImages/ProductImages/${item.ItemIconUrl}`
                : "/assets/images/swasth/pro-phar1.svg",
            heading: item.ItemTitle,
            desc: item.ItemDescription,
            displayOrder: item.DisplayOrder
        }))
    }

    const section6Data = {
        title: product.Section6Title,
        subtitle: product.Section6Subtitle,
        description: product.Section6Description,
        formHeading: product.Section6FormHeading
    }

    const scrollToNetwork = useCallback(() => {
        if (networkSec.current) {
            window.scrollTo({ top: networkSec.current.offsetTop - 110, behavior: "smooth" })
        }
    }, [])

    return (
        <main>
            {hasContent(section1Data) && (
                <ProductHeroSection
                    heading={<>{section1Data.title}<span> {section1Data.subtitle}</span></>}
                    subHeading={section1Data.description}
                     {...(section1Data.buttonText ? { btnText: section1Data.buttonText } : {})}
                    mediaType={section1Data.isVideo ? "video" : "photo"}
                    mediaSrc={section1Data.mediaUrl}
                    onClick={scrollToNetwork}
                />
            )}
            {hasContent(section2Data) && (
                <InfoGraphic
                    classname="procalyx_pharma"
                    imgSrc={section2Data.mediaUrl}
                    heading={<>{section2Data.title} <span>{section2Data.subtitle}</span></>}
                    desc={section2Data.description}
                    btnText={section2Data.buttonText || "Go to Procalyx™"}
                    btnClass="white right fw-bold shadow"
                    linkHref="https://procalyx.com/"
                    target="_blank"
                />
            )}
            {hasContent(section3Data) && <HowItWorks data={section3Data} />}
            {hasContent(section4Data) && (
                <WhySliderSec
                    classname="procalyx_pharma"
                    topHeading={section4Data.description || "Why Partner with Procalyx™"}
                    heading={<>{section4Data.title}<span> {section4Data.subtitle}</span></>}
                    topImage={section4Data.mediaUrl || "/assets/procalyx_bg.png"}
                    whyData={section4Data.items}
                />
            )}
            {hasContent(section6Data) && (
                <NetworkFormSec
                    classname="procalyx_pharma"
                    heading={<>{section6Data.title} <span>{section6Data.subtitle}</span></>}
                    subHeading={section6Data.description}
                    formHeading={section6Data.formHeading || "Book a Demo"}
                    ref={networkSec}
                    ProductName={product.ProductName}
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
