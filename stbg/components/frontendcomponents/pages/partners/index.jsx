"use client";

import NetworkFormSec from "@/components/frontendcomponents/organisms/NetworkFormSec";
import HeroSection from "./HeroSection";
import MeetPartners from "./MeetPartners";
import TrustedClients from "./TrustedClients";
import ScalePartnership from "./ScalePartnership";
import { useGetPartnerPageDataQuery } from "@/store/backendSlice/masterAPISlice";
import "@/uploads/styles/partner/partner.css"

export default function PartnersPage() {
    const { data, isLoading } = useGetPartnerPageDataQuery();
    if (isLoading) return null;

    return (
        <main>
            <HeroSection />
             <ScalePartnership statsData={data.partnerStats} />
           {data?.partnerTestimonials?.length > 0 && (
                <TrustedClients data={data.partnerTestimonials} />
            )}
            {data?.partnerLogos?.length > 0 && (
                <MeetPartners data={data.partnerLogos} />
            )}
            <NetworkFormSec
                classname="partner"
                heading={<>Let’s Build <span>Impact Together </span></>}
                subHeading="Looking to collaborate. Ready to grow. Join our ecosystem and help shape the future of healthcare."
                formHeading=" Partner with us"
                buttonText="Partner with us"
                EnquiryType="Partners"
            />
        </main>
    );
}
