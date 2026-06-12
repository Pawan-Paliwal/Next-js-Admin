"use client"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import InfoGraphic from "../../organisms/InfoGraphic"
import { useGetFooterDataQuery } from "@/store/backendSlice/homeAPISlice";
import Loader from "@/app/loading";
import "@/uploads/styles/swasth/swasth.css"

export default function ProcalyxPage() {
    const { data: data, isLoading } = useGetFooterDataQuery();
    if (isLoading) return <Loader />
    const procalyxData = data.footerProducts?.find(item => item.name === 'procalyx');
    const products = procalyxData?.products || [];
    const IMAGE_BASE_URL = '/OnlineImages/ProductImages/';
    const suffixes = ["Pharmaceutical companies", "Hospitals",];
    const sectionClasses = [
        "procalyx",
        "procalyx_pharma_comp"
    ];
    const btnClasses = [
        "white fw-bold right shadow",
        "fw-bold right shadow"
    ];
    return (
        <main>
            <ProductHeroSection
                classname="procalyx"
                heading={<>Procalyx:<span>Patented AI-Driven Procurement Intelligence</span></>}
                subHeading={`Patented AI-Driven Procurement Intelligence. AI that powers smarter decisions for both Hospitals and Pharma & Med-Device companies. Transforming healthcare supply chains in India.`}
                mediaType="photo"
                mediaSrc="/assets/images/procalyx/procalyx_banner.jpg"
            />

            {products.map((product, index) => {
                const words = product.ProductName.trim().split(" ");
                const prefix = words.slice(0, 2).join(" ");
                const suffix = words.slice(2).join(" ");

                return (
                    <InfoGraphic
                        key={product.ProductId}
                        classname={sectionClasses[index]}
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
                        btnClass={btnClasses[index]}
                        procalyxTm={true}
                    />
                );
            })}

        </main>
    )
}