"use client"
import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import "@/uploads/styles/component/component.css"

export default function WhySliderSec({
    classname = "",
    data = null,
    topHeading = "",
    heading = null,
    topImage = "",
    whyData = []
}) {
    const swiperRef = useRef(null);
    let displayTitle = "";
    let displaySubtitle = "";
    let displayDescription = "";
    let displayMediaUrl = "";
    let displayItems = [];

    if(data && Object.keys(data).length > 0) {
        const {
            title = "",
            subtitle = "",
            description = "",
            mediaUrl = "",
            items = []
        } = data;
        displayTitle = title;
        displaySubtitle = subtitle;
        displayDescription = description;
        displayMediaUrl = mediaUrl || "/assets/logo-vector.svg";
        displayItems = items.map(item => ({
            id: item.ItemId || item.id,
            iconSrc: item.ItemIconUrl
                ? `/OnlineImages/ProductImages/${item.ItemIconUrl}`
                : item.iconSrc || "/assets/images/swasth/pro-hos1.svg",
            heading: item.ItemTitle || item.heading || "",
            desc: item.ItemDescription || item.desc || ""
        }));
    } else {
        displayDescription = topHeading;
        displayMediaUrl = topImage || "/assets/logo-vector.svg";
        displayItems = whyData.map(item => ({
            id: item.id,
            iconSrc: item.iconSrc || "/assets/images/swasth/pro-hos1.svg",
            heading: item.heading || "",
            desc: item.desc || ""
        }));
    }

    const isLegacyHeading = data === null || Object.keys(data || {}).length === 0;

    return (
        <section>
            <div className={`why_slider_sec sec-pad ${classname}`}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="upper_sec">
                            <div className="heading">
                                {displayDescription && <h6>{displayDescription}</h6>}
                                {isLegacyHeading ? (
                                    <h2>{heading}</h2>
                                ) : (
                                    <h2>
                                        {displayTitle} <span>{displaySubtitle}</span>
                                    </h2>
                                )}
                            </div>
                            {displayMediaUrl && (
                                <figure>
                                    <Image
                                        src={displayMediaUrl}
                                        width={550}
                                        height={250}
                                        alt="Image"
                                    />
                                </figure>
                            )}
                        </div>
                        <div className="slider_wrapper">
                            <div className="why-nav swiper-nav center-full">
                                <button type="button" className="why-prev swiper-prev">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeWidth={1.7} d="m7 2l10 10L7 22"></path>
                                    </svg>
                                </button>
                                <button type="button" className="why-next swiper-next">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeWidth={1.7} d="m7 2l10 10L7 22"></path>
                                    </svg>
                                </button>
                            </div>
                            <Swiper
                                ref={swiperRef}
                                className="why_slider"
                                modules={[Navigation]}
                                speed={1000}
                                // loop={displayItems.length > 4}
                                navigation={{
                                    prevEl: ".why-prev",
                                    nextEl: ".why-next"
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1.3,
                                        spaceBetween: 10,
                                    },
                                    540: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 10,
                                    },
                                    991: {
                                        slidesPerView: 4,
                                        spaceBetween: 10,
                                    },
                                }}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {displayItems.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="why_col">
                                            <div className="top_nav">
                                                <div className="icon">
                                                    <Image
                                                        src={item.iconSrc}
                                                        width={48}
                                                        height={48}
                                                        alt={item.heading || "Why Icon"}
                                                    />
                                                </div>
                                                <h6>{item.heading}</h6>
                                            </div>
                                            <div className="desc">
                                                <p>{item.desc}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}