"use client"
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton"
import Button from "@/components/frontendcomponents/atoms/Button"
import "swiper/css";
import "swiper/css/navigation"
import "@/uploads/styles/component/component.css"

export default function CaseStudies({ classname = "", secHeading = "", caseStudyData = [] }) {
    const swiperRef = useRef(null);
    return (
        <section>
            <div className={`case_studies_sec sec-pad ${classname}`}>
                <div className="container">
                    <div className="heading">
                        <h2>{secHeading}</h2>
                    </div>
                    <div className="case_wrapper">
                        <div className="case_study-nav swiper-nav center-full white">
                            <SwiperButton classname="case_study-prev swiper-prev" />
                            <SwiperButton classname="case_study-next swiper-next" />
                        </div>
                        <Swiper
                            ref={swiperRef}
                            className="case_study_slider"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".case_study-prev",
                                nextEl: ".case_study-next"
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.3,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}>
                            {caseStudyData.map((caseData) => (
                                <SwiperSlide key={caseData.id}>
                                    <div className="case_study_col item-md">
                                        <figure>
                                            <Image src={caseData.bgImg} width="670" height="720" alt="Case Study Image"></Image>
                                        </figure>
                                        <figcaption>
                                            <div className="logo_vector">
                                                <Image src="/assets/logo-vector.svg" width="90" height="70" alt="Logo Vector"></Image>
                                            </div>
                                            <div className="case_details">
                                                <h3>{caseData.caseHeading}</h3>
                                                <p className="desc">{caseData.caseDesc}</p>
                                                <div className="case_det_grid">
                                                    {caseData.caseDetails.map((innerData) => (
                                                        <div className="case_det_col" key={innerData.id}>
                                                            <div className="icon">
                                                                <Image src={innerData.caseDetIcon} width="40" height="40" alt="Case Vector"></Image>
                                                            </div>
                                                            {/* <h5>{innerData.caseDetHead}</h5> */}
                                                            <p>{innerData.caseDetDesc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button classname="white" linkHref={caseData.linkHref} buttonText="Read More" />
                                            </div>
                                        </figcaption>
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