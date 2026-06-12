"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import TestimonialCard from "./TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import Slider from "@/components/frontendcomponents/molecules/Slider";

const Testimonial = ({ testimonialData }) => {
  const [swiper, setSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const vectorRef = useRef(null);
  const data = (testimonialData ?? []).map((item) => ({
    organization: item.TestimonialName,
    logo: `/OnlineImages/TestimonialImages/${item.TestimonialImage}`,
    review: item.TestimonialDescription ?? "",
    displayOrder: item.DisplayOrder,
  }));

  useEffect(() => {
    if (!vectorRef.current) return;
    vectorRef.current.style.transform = `rotate(${activeSlide * 45}deg)`;
  }, [activeSlide]);

  return (
    <section className="bg-primary overflow-hidden relative h-fit py-9 md:py-12 lg:py-14 xl:py-20">
      <Image
        ref={vectorRef}
        className="absolute top-[56%] -left-[180px] hidden h-[405px] -translate-y-1/2 transition-transform duration-700 ease-out lg:block"
        src="/vector/icon.svg"
        alt="icon"
        width={400}
        height={405}
      />
      <div className="relative container">
        <Heading className="text-center text-white">
          Trusted by Industry Leaders
        </Heading>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          spaceBetween={40}
          direction="vertical"
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          className="mx-auto hidden! h-[700px] w-fit overflow-hidden md:block! [&_.swiper-slide]:scale-80 [&_.swiper-slide]:opacity-0 [&_.swiper-slide]:transition-all! [&_.swiper-slide]:duration-500! [&_.swiper-slide]:ease-in-out! [&_.swiper-slide]:md:scale-80 [&_.swiper-slide-active]:z-5! [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-next]:-translate-y-[50%] [&_.swiper-slide-next]:opacity-50 [&_.swiper-slide-prev]:translate-y-[50%] [&_.swiper-slide-prev]:opacity-50"
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {data.map((item, i) => (
            <SwiperSlide key={item.TestimonialID ?? i}>
              <TestimonialCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>

        <Slider
          className="mt-9! block overflow-visible! md:mt-14! md:hidden! md:overflow-hidden"
          card="testimonial"
          isBtnVisible={false}
          data={data}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
        />

        <ul className="absolute top-1/2 right-14 hidden -translate-y-1/2 flex-col gap-[18px] lg:flex 2xl:-right-24">
          {data.map((_, i) => {
            const isActive = activeSlide === i;
            return (
              <li
                key={i}
                className={`size-[9px] cursor-pointer rounded-full bg-white transition-all duration-300 ease-in-out ${isActive
                  ? "ring-offset-primary ring ring-white ring-offset-6"
                  : ""
                  }`}
                onClick={() => {
                  setActiveSlide(i);
                  swiper?.slideToLoop(i);
                }}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Testimonial;