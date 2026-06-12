"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";

export default function TrustedClients({ data = [] }) {
    const swiperRef = useRef(null);
    if (!data || data.length === 0) return null;
    return (
        <section>
            <div className="trusted_clients sec-pad-all">
                <div className="container">
                    <div className="upper_sec">
                        <div className="heading">
                            <h2>
                                Trusted by Our <span>Clients</span>
                            </h2>
                            <p>
                                Hear directly from the people who’ve experienced our commitment to quality, reliability, and long-term value.
                            </p>
                        </div>
                        <div className="trusted-nav swiper-nav group">
                            <SwiperButton classname="trusted-prev swiper-prev" />
                            <SwiperButton classname="trusted-next swiper-next" />
                        </div>
                    </div>
                    <div className="trusted_wapper">
                        <Swiper
                            ref={swiperRef}
                            className="trusted_slider"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".trusted-prev",
                                nextEl: ".trusted-next"
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.3,
                                    spaceBetween: 15,
                                },
                                540: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                },
                                991: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                }
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {data.map((trusted) => (
                                <SwiperSlide key={trusted.id || trusted.TestimonialID}>
                                    <div className="trusted_col">
                                        <div className="quote">
                                            <Image src="/assets/icon/quote_grad.svg" width="70" height="70" alt="Quote Icon" />
                                        </div>
                                        <div className="desc">
                                            <p>{trusted.desc || trusted.Description}</p>
                                        </div>
                                        <div className="details">
                                            <div className="icon">
                                                <Image
                                                    src={trusted.imgSrc || (trusted.TestimonialImage ? `/OnlineImages/TestimonialImages/${trusted.TestimonialImage}` : "/assets/images/other/user_testimony.jpg")}
                                                    width="81"
                                                    height="81"
                                                    alt="trusted Image"
                                                />
                                            </div>
                                            <div className="desgn">
                                                <p className="name">{trusted.name || trusted.TestimonialName}</p>
                                                <p className="loc">{trusted.location || trusted.Location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}
