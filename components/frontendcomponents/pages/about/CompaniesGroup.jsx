"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";

const CompaniesGroup = ({ CompaniesGroupData }) => {
  if (!CompaniesGroupData) return null;

  const data = [...(CompaniesGroupData ?? [])]
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      id: item.CompanyID,
      title: item.CompanyName,
      description: item.SmallDescription ?? "",
      image: `/OnlineImages/CompanyImages/${item.CompanyImage}`,
      link: `/${item.CompanyNameURL}`,
    }));

  return (
    <section id="companies" className="bg-primary px-3.75 md:px-0! pt-9 pb-12 md:pt-14 md:pb-20">
      <Heading className="text-center text-white">Our Enterprises</Heading>
      <div className="relative">
        <Slider
          card="company"
          loop={true}
          className="mt-9 md:mt-12 overflow-visible! md:overflow-hidden!"
          isBtnVisible={false}
          navigation={{
            prevEl: `.swiper-prev-company`,
            nextEl: `.swiper-next-company`,
          }}
          data={data}
          modules={[Navigation]}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: {
              slidesPerView: 1.5,
              centeredSlides: true,
              centeredSlidesBounds: true,
              spaceBetween: 120,
            },
            1024: {
              slidesPerView: 1.55,
              centeredSlides: true,
              centeredSlidesBounds: true,
              spaceBetween: 120,
            },
          }}
        />
        <button className="swiper-prev-company md:block! hidden! swiper-button-prev cursor-pointer 2xl:left-[14.5%]! left-44! rotate-180">
          <Image src="/icon/right-white-large.svg" alt="" width={31} height={40} />
        </button>
        <button className="swiper-next-company md:block! hidden! swiper-button-next cursor-pointer 2xl:right-[14.5%]! right-44!">
          <Image src="/icon/right-white-large.svg" alt="" width={31} height={40} />
        </button>
      </div>
    </section>
  );
};

export default CompaniesGroup;