"use client";
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection";
import InfoGraphic from "../../organisms/InfoGraphic";
import "@/uploads/styles/swasth/swasth.css";
import { useGetFooterDataQuery } from "@/store/backendSlice/homeAPISlice";
import Loader from "@/app/loading";

export default function SwastheraPage() {
    const { data, isLoading } = useGetFooterDataQuery();
    if (isLoading) return <Loader />;
    const swastheraData = data?.footerProducts?.find(item => item.name === "swasthera");
    const products = swastheraData?.products || [];

    const IMAGE_BASE_URL = "/OnlineImages/ProductImages/";

    const sectionClasses = [
        "procalyx swasth",
        "procalyx_pharma_comp swasth_hospitals",
        "procalyx_pharma_comp swasth_corporates"
    ];

    const btnClasses = [
        "white right shadow fw-bold",
        "right shadow fw-bold",
        "white right shadow fw-bold"
    ];

    return (
        <main>
            <ProductHeroSection
                classname="procalyx"
                heading={<>Swasthera: <span>A Trusted Ecosystem for Everyday Wellness</span></>}
                subHeading={`A hospital-backed wellness ecosystem connecting families, individuals, and trusted brands—at moments when health decisions truly matter.`}
                mediaType="photo"
                mediaSrc="/assets/images/swasth/swasth_banner.jpg"
            />

            {products.map((product, index) => {
                const classIndex = index % sectionClasses.length;
                const btnClassIndex = index % btnClasses.length;
                const words = product.ProductName.trim().split(" ");
                const prefix = words.slice(0, 2).join(" ");
                const suffix = words.slice(2).join(" ");
                return (
                    <InfoGraphic
                        key={product.ProductId}
                        classname={sectionClasses[classIndex]}
                        imgSrc={`${IMAGE_BASE_URL}${product.ProductMedia}`}
                        heading={
                            <>
                                {prefix} <span>{suffix}</span>
                            </>
                        }
                        desc={
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product.ProductListDescription || ""
                                }}
                            />
                        }
                        btnText="Explore More"
                        btnType="anchor"
                        linkHref={product.ProductNameURL}
                        btnClass={btnClasses[btnClassIndex]}
                    />
                );
            })}
        </main>
    );
}