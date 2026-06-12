"use client"
import Image from "next/image"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import Link from "next/link";

export default function TrendsSec({ mediaData = [] }) {
    const swiperRef = useRef(null);
    return (
        <section>
            <div className="trends_sec sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h1>Insights & Trends <span>Shaping Healthcare</span></h1>
                        <p>Explore insights, stories, and updates shaping the future of care.</p>
                    </div>
                </div>
                <div className="container">
                    <div className="trends_wrapper">
                        <div className="trends-nav swiper-nav group">
                            <SwiperButton classname="trends-prev swiper-prev" />
                            <SwiperButton classname="trends-next swiper-next" />
                        </div>
                        <Swiper
                            ref={swiperRef}
                            className="trends_slider"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".trends-prev",
                                nextEl: ".trends-next"
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 1,
                                    spaceBetween: 25,
                                },
                                991: {
                                    slidesPerView: 1,
                                    spaceBetween: 40,
                                }
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}>
                            {mediaData && mediaData.length > 0 ? (
                                mediaData.map((media) => (
                                    <SwiperSlide key={media.MediaID}>
                                        <Link href={media.ThirdPartyLink} target="_blank" className="trends_col">
                                            <figure>
                                                <Image src={media.MediaImage ? `/OnlineImages/MediaImages/${media.MediaImage}` : "/assets/images/media/trends1.jpg"} width="550" height="500" alt="Trends Image"></Image>
                                            </figure>
                                            <figcaption>
                                                <div className="desc">
                                                    <h6>{media.Title}</h6>
                                                    <p className="date">
                                                        {new Date(media.MediaDate).toLocaleString("en-US", { month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </figcaption>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            ) : (null)}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}