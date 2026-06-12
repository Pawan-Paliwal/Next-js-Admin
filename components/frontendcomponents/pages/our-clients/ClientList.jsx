"use client";
import "swiper/css";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import React, { useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ClientList = ({ clientData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const data = clientData
    ?.slice()
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((type) => ({
      category: type.TypeName,
      list: type.logos
        ?.slice()
        .map((logo) => `/OnlineImages/PartnerLogos/${logo.PartnerLogoImage}`),
    }));

  return (
    <section className="bg-primary py-20">
      <div className="container">
        <Heading className="text-center text-white">Proud to Work With</Heading>
        <p className="mt-2 text-center text-white">
          Strengthening Businesses Through Trusted Partnerships
        </p>
        <div className="mt-14 mb-10 min-w-0">
          <div className="relative px-10">
            <Swiper
              onSwiper={setSwiperRef}
              modules={[Navigation]}
              loop={true}
              slidesPerView="auto"
              spaceBetween={32}
              navigation={{
                prevEl: `.swiper-client-prev`,
                nextEl: `.swiper-client-next`,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              slideToClickedSlide={true}
              freeMode={true}
            >
              {data?.map(({ category }, index) => (
                <SwiperSlide
                  onClick={() => {
                    setActiveIndex(index);
                    swiperRef?.slideToLoop(index);
                  }}
                  className="w-fit! pb-5 [&.swiper-slide-active>h5]:opacity-100 [&.swiper-slide-active>h5:before]:w-full"
                  key={index}
                >
                  <h5 className="relative cursor-pointer text-nowrap text-white opacity-40 before:absolute before:-bottom-4 before:left-0 before:h-px before:w-0 before:bg-white before:opacity-100 before:transition-all before:duration-300">
                    {category}
                  </h5>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-client-prev absolute top-[35%] left-0 -translate-y-1/2 rotate-180 cursor-pointer">
              <Image src="/icon/right-arrow.svg" alt="" width={10} height={20} />
            </button>
            <button className="swiper-client-next absolute top-[35%] right-0 -translate-y-1/2 cursor-pointer">
              <Image src="/icon/right-arrow.svg" alt="" width={10} height={20} />
            </button>
          </div>
        </div>

        {data?.map(({ list }, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              className={`grid grid-cols-5 gap-5 ${isActive ? "pointer-events-auto h-auto translate-y-0 opacity-100" : "pointer-events-none h-0 overflow-hidden translate-y-5 opacity-0"} transition-all duration-300 ease-in`}
              key={index}
            >
              {list?.map((src, i) => (
                <figure
                  className="flex h-35.5 items-center justify-center overflow-hidden rounded-md bg-white p-5"
                  key={i}
                >
                  <Image
                    className="h-full w-auto"
                    src={src}
                    alt=""
                    width={500}
                    height={500}
                  />
                </figure>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ClientList;