"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import Button from "@/components/frontendcomponents/atoms/Button";

export default function ValueAddons({ data, onClick }) {
    const swiperRef = useRef(null);

    if (!data) return null;

    const { title, subtitle, buttonText, items } = data;

    return (
        <section>
            <div className="value_add_sec sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h2>
                            {title} <span>{subtitle}</span>
                        </h2>
                    </div>
                    <div className="value_wrapper">
                        <div className="value-nav swiper-nav center-full">
                            <button type="button" className="value-prev swiper-prev">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18px"
                                    height="18px"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.7}
                                        d="m7 2l10 10L7 22"
                                    ></path>
                                </svg>
                            </button>
                            <button type="button" className="value-next swiper-next">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18px"
                                    height="18px"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.7}
                                        d="m7 2l10 10L7 22"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <Swiper
                            ref={swiperRef}
                            className="value_slider"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".value-prev",
                                nextEl: ".value-next",
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1.3, spaceBetween: 10 },
                                540: { slidesPerView: 2, spaceBetween: 15 },
                                991: { slidesPerView: 3, spaceBetween: 15 },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {items?.map((item, index) => (
                                <SwiperSlide key={item.ItemId || index}>
                                    <div className="value_col">
                                        <div className="top_nav">
                                            <h6>{item.ItemTitle}</h6>
                                            <div className="count">
                                                <span>{String(index + 1).padStart(2, "0")}</span>
                                            </div>
                                        </div>
                                        <div className="desc">
                                            <p>{item.ItemDescription}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    {/* {buttonText && (
                        <div className="btn_wrap">
                            <Button buttonText={buttonText} classname="down" onClick={onClick} />
                        </div>
                    )} */}

                </div>
            </div>
        </section>
    );
}
