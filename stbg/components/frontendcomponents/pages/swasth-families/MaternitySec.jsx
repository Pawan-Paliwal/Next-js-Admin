"use client"
import Image from "next/image"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton"
import Button from "@/components/frontendcomponents/atoms/Button"

export default function MaternitySec({ data, onClick }) {
    const swiperRef = useRef(null);

    if (!data) return null;

    const getFileExtension = (filename) => {
        if (!filename) return null;
        return filename.split('.').pop().toLowerCase();
    };

    const isVideo = data.mediaUrl && getFileExtension(data.mediaUrl) === 'mp4';

    return (
        <section>
            <div className="swasth-secD sec-pad-all">
                <div className="container">
                    <div className="maternity_wrapper">
                        {isVideo ? (
                            <video
                                src={data.mediaUrl}
                                poster={data.mediaUrl?.replace('.mp4', '_poster.png')}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        ) : (
                            data.mediaUrl && <Image src={data.mediaUrl} width="1200" height="800" alt="" />
                        )}
                        <div className="content">
                            <div className="heading">
                                <h2>{data.title} <span>{data.subtitle}</span></h2>
                                <p>{data.description}</p>
                            </div>
                            <div className="benefits_wrapper">
                                <h6>Benefits</h6>
                                <div className="benefits_slider_wrap">
                                    <div className="benefits-nav swiper-nav center-full no-bg">
                                        <button type="button" className="benefits-prev swiper-prev">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="#fff"
                                                    strokeWidth={1.7}
                                                    d="m7 2l10 10L7 22"
                                                ></path>
                                            </svg>
                                        </button>
                                        <button type="button" className="benefits-next swiper-next">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="#fff"
                                                    strokeWidth={1.7}
                                                    d="m7 2l10 10L7 22"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <Swiper
                                        ref={swiperRef}
                                        className="benefits_slider"
                                        modules={[Navigation]}
                                        speed={1000}
                                        navigation={{
                                            prevEl: ".benefits-prev",
                                            nextEl: ".benefits-next"
                                        }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1.3,
                                                spaceBetween: 10,
                                            },
                                            540: {
                                                slidesPerView: 2,
                                                spaceBetween: 10,
                                            }
                                        }}
                                        onSwiper={(swiper) => (swiperRef.current = swiper)}>
                                        {data.items && data.items.length > 0 && data.items.map((item, index) => (
                                            <SwiperSlide key={item.ItemId}>
                                                <div className="maternity_col">
                                                    <div className="info">
                                                        <h5>{item.ItemTitle}</h5>
                                                        {item.ItemDescription && <p>{item.ItemDescription}</p>}
                                                    </div>
                                                    <div className="count">{String(index + 1).padStart(2, '0')}</div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                {data.buttonText && (
                                    <Button classname="white down" onClick={onClick} buttonText={data.buttonText} />
                                )}
                            </div>
                        </div>
                        <figure className="logo_icon">
                            <Image src="/assets/logo-vector.svg" width="80" height="60" alt="Logo Icon" />
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    )
}