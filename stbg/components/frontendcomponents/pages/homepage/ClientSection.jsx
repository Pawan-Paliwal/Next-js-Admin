"use client"
import { useRef } from "react"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export default function ClientSection({ partnerLogos = [] }) {
    const swiperRef = useRef(null);
    return (
        <section>
            <div className="home-secD sec-pad-all">
                <div className="container">
                    <div className="main_wrapper">
                        <div className="heading">
                            <h2>Trusted by Leading <span> Healthcare Institutions</span></h2>
                            <div className="desc">
                                <p>Built on trust and collaboration, this ecosystem is chosen by leading healthcare institutions to drive meaningful, scalable impact across healthcare.</p>
                            </div>
                        </div>
                        <div className="client_sec">
                            <div className="colA">
                                <Swiper
                                    className="client_slider"
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
                                            allowTouchMove: false,
                                        },
                                        540: {
                                            slidesPerView: 3,
                                            spaceBetween: 10,
                                            allowTouchMove: false,
                                        },
                                        991: {
                                            slidesPerView: 4,
                                            spaceBetween: 15,
                                            allowTouchMove: true,
                                        },
                                    }}
                                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                                >
                                   {partnerLogos.filter((_, index) => index % 2 === 1).map((logo) => (
                                        <SwiperSlide key={`slider1-${logo.id}`}>
                                        <figure>
                                            <Image
                                            src={logo.image}
                                            alt="Client Logo"
                                            width={200}
                                            height={110}
                                            />
                                        </figure>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    className="client_slider"
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
                                            allowTouchMove: false,
                                        },
                                        540: {
                                            slidesPerView: 3,
                                            spaceBetween: 10,
                                            allowTouchMove: false,
                                        },
                                        991: {
                                            slidesPerView: 4,
                                            spaceBetween: 15,
                                            allowTouchMove: true,
                                        },
                                    }}
                                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                                >
                                    {partnerLogos.filter((_, index) => index % 2 === 0).map((logo) => (
                                        <SwiperSlide key={`slider1-${logo.id}`}>
                                        <figure>
                                            <Image
                                            src={logo.image}
                                            alt="Client Logo"
                                            width={200}
                                            height={110}
                                            />
                                        </figure>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="colB">
                                <div className="logo-vector">
                                    <video src="/assets/video/vector-video.mp4" autoPlay muted loop playsInline></video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}