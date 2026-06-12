"use client";
import { useRef } from "react"
import { useGetCareerPageDataQuery } from "@/store/backendSlice/masterAPISlice";
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection";
import TeamInfo from "./TeamInfo";
import LifeOrganisation from "./LifeOrganisation";
import OpenPositions from "./OpenPositions";
import PositionsPop from "@/components/frontendcomponents/molecules/PositionsPop";
import FutureColleagues from "./FutureColleagues";
import TestimonialsPop from "@/components/frontendcomponents/organisms/TestimonialsPop"
import "@/uploads/styles/career/career.css";

export default function CareersPage() {
    const positionsSec = useRef(null)
    const activeScroll = (ref) => {
        if (ref.current) {
            const top = ref.current.offsetTop - 110;
            window.scrollTo({
                top,
                behavior: "smooth"
            })
        }
    }
    const { data, isLoading, isError } = useGetCareerPageDataQuery();
    const openPositionsData = data?.jobData || [];
    const careerTestimonials = data?.testimonialData || [];

    return (
        <main>
            <ProductHeroSection
                heading={<>Where Your Ambition Finds Purpose:<span> Innovating Healthcare</span></>}
                subHeading="An opportunity to innovate, learn, and create a lasting impact on the healthcare landscape. Work involves building the foundational infrastructure that delivers Healthcare access to every stakeholder."
                btnText="Join Now"
                mediaSrc="assets/video/career_banner.mp4"
                videoPoster="assets/video/career_banner_poster.png"
                onClick={() => activeScroll(positionsSec)}
            />
            <TeamInfo />
            <LifeOrganisation />
            {openPositionsData.length > 0 && (
                <OpenPositions positions={openPositionsData} ref={positionsSec} />
            )}
            {careerTestimonials.length > 0 && (
                <FutureColleagues testimonials={careerTestimonials} />
            )}
            <PositionsPop />
            <TestimonialsPop />
        </main>
    );
}
