"use client"
import Image from "next/image";
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import "@/uploads/styles/component/component.css"

export default function Milestone({ classname = "", heading = "", MilestoneData = [] }) {
    const swiperRef = useRef(null);
    return (
        <section>
            <div className={`milestone_sec sec-pad-all ${classname}`}>
                <div className="container">
                    <div className="heading">
                        <h2>{heading}</h2>
                    </div>

                    <div className="milestone_wrapper">
                        <div className="milestone-nav swiper-nav white-border group">
                            <SwiperButton classname="milestone-prev swiper-prev" />
                            <SwiperButton classname="milestone-next swiper-next" />
                        </div>
                        <div className="colA">
                            <Swiper
                                ref={swiperRef}
                                className="heading_slider"
                                loop={true}
                                navigation={{
                                    prevEl: ".milestone-prev",
                                    nextEl: ".milestone-next"
                                }}
                                allowTouchMove= {false}
                                modules={[Navigation]}
                                direction="vertical"
                                speed={1000}
                                slidesPerView={1}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {MilestoneData.map((milestone) => (
                                    <SwiperSlide key={`heading-${milestone.id}`}>
                                        <p>{milestone.title}</p>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="colB">
                            <Swiper
                                className="milestone_trophy_slider"
                                loop={true}
                                navigation={{
                                    prevEl: ".milestone-prev",
                                    nextEl: ".milestone-next"
                                }}
                                allowTouchMove= {false}
                                modules={[Navigation]}
                                direction="horizontal"
                                ref={swiperRef}
                                spaceBetween={20}
                                speed={1000}
                                slidesPerView={1}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {MilestoneData.map((milestone) => (
                                    <SwiperSlide key={`trophy-${milestone.id}`}>
                                        <figure>
                                            <Image
                                                src={milestone.image}
                                                width="215"
                                                height="500"
                                                alt="Trophy Image"
                                            />
                                        </figure>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="colC">
                            <Swiper
                                ref={swiperRef}
                                className="description_slider"
                                loop={true}
                                navigation={{
                                    prevEl: ".milestone-prev",
                                    nextEl: ".milestone-next"
                                }}
                                allowTouchMove= {false}
                                modules={[Navigation]}
                                direction="vertical"
                                speed={1000}
                                slidesPerView={1}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {MilestoneData.map((milestone) => (
                                    <SwiperSlide key={`desc-${milestone.id}`}>
                                        <p>{milestone.description}</p>
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
