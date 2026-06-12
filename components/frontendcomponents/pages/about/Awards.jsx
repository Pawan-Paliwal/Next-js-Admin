"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import useFancybox from "@/hooks/useFancybox";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";

const Awards = ({ AwardData }) => {
  const [setRoot] = useFancybox();

  const sliderData = AwardData?.map((item) => ({
    id: item.AwardLogoID,
    title: item.title ?? "Award",
    image: item.AwardLogoImage ? `/OnlineImages/AwardImages/${item.AwardLogoImage}` : "",
    displayOrder: item.DisplayOrder,
  }))
    .sort((a, b) => a.displayOrder - b.displayOrder) ?? data;

  return (
    <section id="awards" className="bg-background py-9 md:py-14">
      <div ref={setRoot} className="container">
        <Heading className="text-center">Awards & Recognition</Heading>
        <div className="relative mt-7 md:mt-12">
          <Slider
            className="[&_.swiper-slide]:opacity-50 overflow-visible! md:overflow-hidden!   [&_.swiper-slide]:transition-all! [&_.swiper-slide]:duration-500! [&_.swiper-slide]:ease-in-out! [&_.swiper-slide]:md:scale-80 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-active_figcaption]:opacity-100 [&_.swiper-slide-active_img]:shadow-[0px_6.78px_20.34px_0px_#959DA533] [&_figcaption]:opacity-0"
            card="award"
            spaceBetween={1000}
            isBtnVisible={false}

            slidesPerView={1.2}
            loop={true}
            data={sliderData}
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-prev-award",
              prevEl: ".swiper-next-award",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: true,
                centeredSlidesBounds: true,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
                centeredSlidesBounds: true,
              },
            }}
          />
          <button className="swiper-prev-award z-1! swiper-button-prev absolute left-85! hidden! rotate-180 md:block!">
            <Image
              src="/icon/right-blue-large.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>
          <button className="swiper-next-award z-1!   swiper-button-next absolute right-85! hidden! md:block!">
            <Image
              src="/icon/right-blue-large.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Awards;
