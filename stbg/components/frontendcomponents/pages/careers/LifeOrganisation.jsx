"use client"
import Image from "next/image"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay  } from "swiper/modules";
import "swiper/css"; 
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";

export default function LifeOrganisation(){
    const swiperRef = useRef(null);
    return(
        <section>
            <div className="life_org_sec sec-pad-all sec-pad_career">
                <div className="container">
                    <div className="heading">
                        <h2>Life at the <span>Organization</span></h2>
                        <p>Innovation thrives where talent feels valued. A glimpse into an environment where collaboration, learning, and celebration are part of the daily routine.</p>
                    </div>
                </div>
                <div className="life_wrapper">
                    <Swiper
                        ref={swiperRef}
                        className="life_slider"
                        loop={true}  
                        modules={[Navigation, Pagination, Autoplay]}
                        speed={1000}
                        autoplay={{
                            delay: 1000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: ".life-prev",
                            nextEl: ".life-next"
                        }}
                        pagination= {{
                            enabled: true, 
                            el: '.progressbar',
                            type: 'progressbar'
                        }}
                        centeredSlides={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.5,
                                spaceBetween: 5,
                            },
                            540: {
                                slidesPerView: 1.8,
                                spaceBetween: 15,
                            },
                            991: {
                                slidesPerView: 2.5,
                                spaceBetween: 20,
                            }
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career1.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career2.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career3.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career1.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career2.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                            <SwiperSlide>
                                <figure>
                                    <Image src="/assets/images/career/career3.jpg" width="550" height="430" alt="Career"></Image>
                                </figure>
                            </SwiperSlide>
                    </Swiper>
                    <div className="nav_wrapper swiper-nav black-border">
                        <SwiperButton classname="life-prev swiper-prev" />
                        <div className="progressbar"></div>
                        <SwiperButton classname="life-next swiper-next" />
                    </div>
                </div>
            </div>
        </section>
    )
}