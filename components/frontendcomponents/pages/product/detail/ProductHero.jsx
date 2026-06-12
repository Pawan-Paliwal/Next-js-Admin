"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";

const ProductHero = ({ heroData, gallery = [] }) => {
  const slides = gallery.length > 0
    ? gallery.map((g) => `/OnlineImages/ProductImages/${g.ImageUrl}`)
    : [`/OnlineImages/ProductImages/${heroData?.ProductMedia}`];

  return (
    <section className="relative h-[400px] before:absolute before:inset-0 before:z-2 before:bg-[linear-gradient(0deg,rgba(0,0,0,0.7)_9.03%,rgba(102,102,102,0)_62.22%)] md:h-[60vh] lg:h-[70vh]">
      <Swiper
        effect="fade"
        loop={true}
        modules={[Autoplay, EffectFade]}
        className="h-full w-full overflow-hidden"
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={800}
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img}
              alt={heroData?.ProductName || "banner"}
              width={2870}
              height={1283}
              className="block size-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-[34px] left-1/2 z-3 container -translate-x-1/2 md:bottom-[120px]">
        <div>
          <h1 className="mx-auto max-w-[529px] text-center text-4xl text-[28px] leading-[1.2] font-bold text-white md:text-[42px] lg:text-[48px] xl:max-w-[668px] xl:text-6xl 2xl:max-w-[600px]">
            {heroData?.ProductName}
          </h1>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-sm leading-normal text-white md:mt-4 md:max-w-[401px] md:text-base 2xl:max-w-[500px] 2xl:text-lg">
            {heroData?.ProductSmallDescription}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;

