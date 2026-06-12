"use client"
import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function HowItWorks({ data }) {
  const swiperRef = useRef(null);

  const title = data?.title || "How It Works";
  const description=
    data?.description ||
    "";

  const items = data?.items || [];

  const sliderItems =
    items.length > 0
      ? items
      : [
          {
            id: 1,
            title: "",
            description:
              "",
            iconUrl: "",
          },
        ];

  return (
    <section>
      <div className="how_it_works sec-pad-all procalyx_pharma">
        <div className="container-fluid">
          <div className="heading">
            <h2>{title} <span>{description}</span></h2>
            {/* <p></p> */}
          </div>

          <div className="how_wrapper">
            <div className="how-nav swiper-nav center-full">
              <button type="button" className="how-prev swiper-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeWidth={1.7} d="m7 2l10 10L7 22" />
                </svg>
              </button>
              <button type="button" className="how-next swiper-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeWidth={1.7} d="m7 2l10 10L7 22" />
                </svg>
              </button>
            </div>

            <Swiper
              ref={swiperRef}
              className="how_slider"
              modules={[Navigation]}
              centeredSlides={true}
              loop={sliderItems.length > 1}
              speed={1000}
              navigation={{
                prevEl: ".how-prev",
                nextEl: ".how-next",
              }}
              breakpoints={{
                0: { slidesPerView: 1.3, spaceBetween: 10 },
                540: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 10 },
                991: { slidesPerView: 1.5, spaceBetween: 50 },
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {sliderItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="how_col">
                    <figcaption>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </figcaption>
                    <figure>
                      <Image
                        src={item.iconUrl || "/assets/images/procalyx/pharma_how1.jpg"}
                        width={410}
                        height={340}
                        alt={item.title || "How Works"}
                      />
                    </figure>
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
