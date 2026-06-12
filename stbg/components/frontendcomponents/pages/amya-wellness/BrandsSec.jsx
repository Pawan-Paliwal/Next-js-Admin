"use client"
import { useRef } from "react"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export default function BrandsSec({ data = {} }) {
    const {
        title = "",
        subtitle = "",
        items = []
    } = data
    const swiperRef = useRef(null);

    return (
        <section>
            <div className="brands_secc sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h2>{title} <span>{subtitle}</span></h2>
                    </div>
                    <div className="brands__wrapper">
                        <Swiper
                            className="brand__slider"
                            loop={true}
                            ref={swiperRef}
                            modules={[Autoplay]}
                            slidesPerView={1}
                            spaceBetween={40}
                            speed={2000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 10,
                                },
                                540: {
                                    slidesPerView: 4,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 5,
                                    spaceBetween: 10,
                                },
                                991: {
                                    slidesPerView: 6,
                                    spaceBetween: 15,
                                },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {items.filter((_, index) => index % 2 === 1).map((item, index) => (
                                <SwiperSlide key={`ltr-${item.BrandId || index}`}>
                                    <figure>
                                        <Image
                                            src={`/OnlineImages/ProductImages/${item.ItemIconUrl}`}
                                            alt={item.BrandName || "Brand Logo"}
                                            width="200"
                                            height="110"
                                        />
                                    </figure>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            className="brand__slider"
                            loop={true}
                            ref={swiperRef}
                            modules={[Autoplay]}
                            dir="rtl"
                            slidesPerView={1}
                            spaceBetween={40}
                            speed={2000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 10,
                                },
                                540: {
                                    slidesPerView: 4,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 5,
                                    spaceBetween: 10,
                                },
                                991: {
                                    slidesPerView: 6,
                                    spaceBetween: 15,
                                },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {items.filter((_, index) => index % 2 === 0).map((item, index) => (
                                <SwiperSlide key={`rtl-${item.BrandId || index}`}>
                                    <figure>
                                        <Image
                                            src={`/OnlineImages/ProductImages/${item.ItemIconUrl}`}
                                            alt={item.BrandName || "Brand Logo"}
                                            width="200"
                                            height="110"
                                        />
                                    </figure>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}