"use client"

import Image from "next/image"
import { useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay"

export default function OperationalFlow({ data = {} }) {
    const {
        title = "",
        subtitle = "",
        items = []
    } = data;

    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleAccordion = useCallback(
        (index) => {
            setActiveIndex((prev) => (prev === index ? null : index));
        },
        []
    );

    return (
        <section>
            <div className="operational_flow_sec sec-pad">
                <div className="container">
                    <div className="heading">
                        <h2>
                            {title} <span>{subtitle}</span>
                        </h2>
                    </div>
                    <div className="operational_wrapper">
                        <div className="colA">
                            <div className="hand_wrapper">
                                <Image src="/assets/images/swasth/hand_vector.svg" width="400" height="700" alt="Hand Vector" className="hand_img"></Image>
                                <Swiper
                                    ref={swiperRef}
                                    className="hand_slider"
                                    direction="vertical"
                                    modules={[Autoplay]}
                                    autoplay = {{
                                        delay: 1000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true
                                    }}
                                    speed={1000}
                                    slidesPerView={1}
                                    onSwiper={(swiper) => (swiperRef.current = swiper)}>
                                    {items.map((item) => (
                                        <SwiperSlide key={item.ItemId}>
                                            <div className="hand_col">
                                                <div className="icon">
                                                    <Image
                                                        src={`/OnlineImages/ProductImages/${item.ItemIconUrl}`}
                                                        width="56"
                                                        height="56"
                                                        alt={item.ItemTitle}
                                                    />
                                                </div>
                                                <h6>{item.ItemTitle}</h6>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="flow_details">
                                {items.map((item, index) => {
                                    const isOpen = activeIndex === index;
                                    return (
                                        <div key={item.ItemId} className={`flow_col ${isOpen ? "active" : ""}`} onClick={() => toggleAccordion(index)}>
                                            <div className="circle">
                                                <div className="icon"></div>
                                            </div>
                                            <div className="flow_content">
                                                <h6>{item.ItemTitle}</h6>
                                                <div className="desc">
                                                    <p>{item.ItemDescription || ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}