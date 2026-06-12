"use client"
import Image from "next/image"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import "@/uploads/styles/component/component.css"

export default function Testimonials({ TestimonialData = [], classname = "", heading = "" }) {
    const swiperRef = useRef(null);

    return (
        <section>
            <div className={`testimonial_sec sec-pad-all ${classname}`}>
                <div className="container">
                    <div className="upper_sec">
                        <div className="heading">
                            <h2>{heading}</h2>
                        </div>
                        <div className="testimonial-nav swiper-nav">
                            <SwiperButton classname="testimonial-prev swiper-prev" />
                            <SwiperButton classname="testimonial-next swiper-next" />
                        </div>
                    </div>
                    <div className="testimonial_wrapper">
                        <Swiper
                            ref={swiperRef}
                            className="testimonial_slider"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".testimonial-prev",
                                nextEl: ".testimonial-next"
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.3,
                                    spaceBetween: 15,
                                },
                                540: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                }
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {TestimonialData.map((testimony) => (
                                <SwiperSlide key={testimony.id}>
                                    <div className="testimonial_col">
                                        <div className="icon">
                                            <Image
                                                src={testimony.imgSrc}
                                                width={81}
                                                height={81}
                                                alt={testimony.name || "Testimony Image"}
                                            />
                                        </div>
                                        <div className="desc">
                                            <p>{testimony.desc}</p>
                                        </div>
                                        <div className="desgn">
                                            <p className="name">{testimony.name}</p>
                                            <p className="loc">{testimony.location}</p>
                                        </div>
                                        <div className="quote">
                                            <Image
                                                src="/assets/icon/quote.svg"
                                                width={70}
                                                height={70}
                                                alt="Quote Icon"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}