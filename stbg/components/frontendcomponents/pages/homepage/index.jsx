"use client";
import { useGetHomeDataQuery, useGetProductSectionDataQuery } from "@/store/backendSlice/homeAPISlice";
import HeroSection from "./HeroSection";
import ServicesTab from "./ServicesTab";
import InnovationSection from "./InnovationSection";
import ClientSection from "./ClientSection";
import GlobalSuccess from "./GlobalSuccess";
import Milestone from "../../organisms/Milestone";
import Testimonials from "@/components/frontendcomponents/organisms/Testimonials";
import "@/uploads/styles/home/home.css";
import Loader from "@/app/loading";

export default function HomePage() {
    const { data: homeData, isLoading } = useGetHomeDataQuery();
    const { data: productData, isLoading: productLoading } = useGetProductSectionDataQuery();
    const partnerLogos = homeData?.partnerLogos || [];
    const homeTestimonials = homeData?.homeTestimonials || [];
    const milestones = homeData?.milestones || [];

    const categoriesWithProducts = Array.isArray(productData) ? productData : (productData?.data || []);
    const validCategories = categoriesWithProducts.filter((category) => category?.products && category.products.length > 0);

    const TestimonialData = homeTestimonials.map((item) => ({
        id: item.TestimonialID,
        imgSrc: item.TestimonialImage
            ? `/OnlineImages/TestimonialImages/${item.TestimonialImage}`
            : "/assets/images/other/testimony.jpg",
        desc: item.Description,
        name: item.TestimonialName,
        location: item.Location,
    }));

    const MilestoneData = milestones.map((item) => ({
        id: item.MilestoneID,
        title: item.Title,
        description: item.Description,
        image: item.MilestoneImage
            ? `/OnlineImages/MilestoneImages/${item.MilestoneImage}`
            : "/assets/images/home/trophy.png",
    }));

    const PartnerLogoData = partnerLogos.map((item) => ({
        id: item.PartnerLogoID,
        image: item.PartnerLogoImage
            ? `/OnlineImages/PartnerLogoImages/${item.PartnerLogoImage}`
            : null,
        displayOrder: item.DisplayOrder,
    }));

    if (isLoading || productLoading) {
        return (
            <Loader />
        );
    }

      return (
        <main>
            <HeroSection />
            {validCategories.length > 0 && (
                <ServicesTab categoriesWithProducts={validCategories} />
            )}
            <InnovationSection />
            {PartnerLogoData.length > 0 && (
                <ClientSection partnerLogos={PartnerLogoData} />
            )}
            {TestimonialData.length > 0 && (
                <Testimonials
                    classname="home_testimony"
                    heading={<>Voices from across <span>the ecosystem</span></>}
                    TestimonialData={TestimonialData}
                />
            )}
            {MilestoneData.length > 0 && (
                <Milestone
                    heading={<>Milestones Defining <span>The Path of Innovation</span></>}
                    MilestoneData={MilestoneData}
                />
            )}
            <GlobalSuccess />
        </main>
    );
}