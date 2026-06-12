"use client"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import ContactForm from "./ContactForm"
import MapSection from "./MapSection"
import LocationSec from "./LocationSec"
import "@/uploads/styles/contact/contact.css"
import { useGetFooterDataQuery } from "@/store/backendSlice/homeAPISlice";


export default function ContactUsPage() {
    const { data: Contactdata, isLoading } = useGetFooterDataQuery();
    const StaticData = Contactdata?.footerStatic || {};
    return (
        <main>
            <ProductHeroSection
                classname="contact_us"
                heading={<>Healthcare Made Possible<span> Through Partnerships</span></>}
                subHeading={`Your goals. Our platform. Collaborate with us to simplify healthcare and deliver value to those who matter most. <span>Join Us—Let’s Build Tomorrow Together.</span>`}
                btnText="Join Us"
                btnClass="right fw-bold"
                mediaSrc="assets/video/contact_banner.mp4"
                videoPoster="assets/video/contact_banner_poster.png"
                linkHref="/careers"
            />
            <ContactForm />
            <MapSection data={StaticData} />
            <LocationSec />
        </main>
    )
}