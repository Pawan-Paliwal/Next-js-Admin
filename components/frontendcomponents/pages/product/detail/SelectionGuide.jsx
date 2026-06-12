"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SelectionGuide = ({ selection, circuits = [] }) => {
  return (
    <section id="ball-mill-circuits" className="bg-white py-20">
      <div className="container grid grid-cols-[1fr_456px] gap-20">
        <div className="relative min-w-0 px-20">
          <Swiper
            spaceBetween={32}
            loop={true}
            slidesPerView={1}
            modules={[Navigation]}
            navigation={{
              prevEl: ".swiper-selection-prev",
              nextEl: ".swiper-selection-next",
            }}
          >
            {circuits.map((item, i) => (
              <SwiperSlide key={i}>
                <figure className="flex-center h-85.5 flex-col gap-2 rounded-sm border border-[#DBDBDB] p-5">
                  <p className="text-center">{item.Description}</p>
                  <Image
                    src={`/OnlineImages/ProductImages/${item.ImageUrl}`}
                    alt="machine"
                    width={1920}
                    height={1080}
                  />
                </figure>
                <figcaption className="mt-8 text-center font-medium text-black">
                  {item.Description}
                </figcaption>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="swiper-selection-prev left-0 rotate-180 cursor-pointer absolute top-1/2 -translate-y-1/2">
            <Image
              src="/icon/right_blue.svg"
              alt="arrow-left"
              width={39}
              height={39}
            />
          </button>
          <button className="swiper-selection-next right-0 absolute cursor-pointer top-1/2 -translate-y-1/2">
            <Image
              src="/icon/right_blue.svg"
              alt="arrow-right"
              width={39}
              height={39}
            />
          </button>
        </div>

        <div className="[&_ul>li]:before:bg-primary [&_p]:mb-4 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:not-last:mb-2 [&_ul>li]:before:absolute [&_ul>li]:before:top-2 [&_ul>li]:before:left-0 [&_ul>li]:before:size-2 [&_ul>li]:before:bg-no-repeat [&_ul>li]:before:content-['']">
          <Heading className="mb-5">{selection?.Section4Title}</Heading>
          <div dangerouslySetInnerHTML={{ __html: selection?.Section4Description }} />
        </div>
      </div>
    </section>
  );
};

export default SelectionGuide;