"use client"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton"
import ServiceCol from "@/components/frontendcomponents/molecules/ServiceCol"
import { useGetProductSectionDataQuery } from "@/store/backendSlice/homeAPISlice";
import Loader from "@/app/loading";
import "swiper/css";
import "swiper/css/navigation"

export default function ServicesTab() {
    const swiperRef = useRef(null);
    const [activeService, setActiveService] = useState(0);
    const { data, isLoading } = useGetProductSectionDataQuery();
    const categoriesWithProducts = Array.isArray(data) ? data : (data?.data || []);

    const validCategories = categoriesWithProducts.filter(
        (category) => category?.products && category.products.length > 0
    );

    useEffect(() => {
        if (validCategories.length > 0 && activeService >= validCategories.length) {
            setActiveService(0);
        }
    }, [validCategories, activeService]);

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (validCategories.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="home-secB sec-pad">
                <div className="container">
                    <div className="heading">
                        <h2>Solutions Built <span> Around Every Role</span></h2>
                    </div>
                    <div className="services_wrapper">
                        <div className="tab-nav">
                            {validCategories.map((category, index) => (
                                <li
                                    key={category.categoryId || index}
                                    className={`${activeService === index ? "active" : ""}`}
                                    onClick={() => setActiveService(index)}
                                >
                                    <div className="icon">
                                        <Image
                                            src={`/OnlineImages/CategoryImages/${category.categoryImage}`}
                                            width="31"
                                            height="31"
                                            alt={category.categoryName || "Service Icon"}
                                        />
                                    </div>
                                    <p>{category.categoryName}</p>
                                </li>
                            ))}
                        </div>
                        <div className="tab-nav-content">
                            {validCategories.map((category, index) => (
                                <div
                                    key={category.categoryId || index}
                                    className={`tabs ${activeService === index ? "active" : ""}`}
                                >
                                    <div className="service_container">
                                        <div className="service-nav swiper-nav center-full white">
                                            <SwiperButton classname={`service-prev-${index} swiper-prev`} />
                                            <SwiperButton classname={`service-next-${index} swiper-next`} />
                                        </div>
                                        <Swiper
                                            ref={swiperRef}
                                            className="service_slider"
                                            modules={[Navigation]}
                                            speed={600}
                                            navigation={{
                                                prevEl: `.service-prev-${index}`,
                                                nextEl: `.service-next-${index}`
                                            }}
                                            breakpoints={{
                                                0: {
                                                    slidesPerView: 1.3,
                                                    spaceBetween: 10,
                                                },
                                                540: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20,
                                                }
                                            }}
                                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                                        >
                                            {category.products.map((product, pIndex) => (
                                                <SwiperSlide key={product.productId || pIndex}>
                                                    <ServiceCol
                                                        linkHref={`/${product.productNameURL}`}
                                                        mediaType={
                                                            product.productImage?.endsWith(".mp4")
                                                                ? "video"
                                                                : "image"
                                                        }
                                                        mediaSrc={`/OnlineImages/ProductImages/${product.productImage}`}
                                                        //  title={(() => {
                                                        //     const name = product.productName || "";
                                                        //     if (name.startsWith("Procalyx")) return "Procalyx";
                                                        //     if (name.trim().toLowerCase() === "swasth for families") return "Swasth";
                                                        //     if (name.trim().toLowerCase() === "swasth for hospitals") return "Swasth";
                                                        //     if (name.trim().toLowerCase() === "swasth for corporates") return "Swasth Corporate";
                                                        //     return name;
                                                        // })()}
                                                        title={product.ProductHeaderListName || product.productName || ""}
                                                        desc={product.productDescription}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}