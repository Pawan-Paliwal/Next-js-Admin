"use client";
import Image from "next/image";
import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const TrunkeyOverview = ({ turnkeyProject }) => {
  const images = [
    turnkeyProject?.Image1,
    turnkeyProject?.Image2,
    turnkeyProject?.Image3,
  ].filter(Boolean).map((img) => `/OnlineImages/ClientTypeImages/${img}`);

  return (
    <section id="overview" className="py-18">
      <div className="container grid grid-cols-[1fr_407px] gap-42">
        <div>
          <h2 className="mb-5 text-4xl font-bold">{turnkeyProject?.Heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: turnkeyProject?.Description }} />
        </div>

        <div className="overflow-hidden rounded-md">
          <Swiper
            className="[&_.swiper-pagination-bullet-active]:bg-primary! [&_.swiper-pagination]:static! [&_.swiper-pagination]:bg-[#F2F2F2] [&_.swiper-pagination]:p-2.5 [&_.swiper-pagination-bullet]:size-2!"
            loop={true}
            slidesPerView={1}
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <figure className="h-65.25">
                  <Image
                    src={src}
                    alt={`${turnkeyProject?.TypeName} image ${idx + 1}`}
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover"
                  />
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TrunkeyOverview;