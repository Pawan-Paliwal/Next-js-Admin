"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import React from "react";
import FeaturedVideoCard from "./FeaturedVideoCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const FeaturedVideo = ({ videoGalleryData }) => {
  const data = videoGalleryData?.map((item) => ({
    title: item.galleryTitle,
    image: `/OnlineImages/GalleryImages/${item.galleryImage}`,
    video: item.galleryVideoURL,
  }));

  return (
    <section className="py-20">
      <div className="container">
        <Heading className="text-center">Video Gallery</Heading>
        <Swiper
          effect="coverflow"
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          slidesPerView="auto"
          spaceBetween={10}
          modules={[EffectCoverflow]}
          coverflowEffect={{
            rotate: -34,
            stretch: 40,
            depth: 165,
            modifier: 1,
            slideShadows: true,
          }}
          className="mt-16 [&_.swiper-slide]:w-[570px]! [&_.swiper-slide]:overflow-hidden [&_.swiper-slide]:rounded-md [&_.swiper-slide-next]:pointer-events-none [&_.swiper-slide-next>figure]:blur-xs [&_.swiper-slide-prev]:pointer-events-none [&_.swiper-slide-prev>figure]:blur-xs"
        >
          {data?.map((item, i) => (
            <SwiperSlide key={i}>
              <FeaturedVideoCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedVideo;