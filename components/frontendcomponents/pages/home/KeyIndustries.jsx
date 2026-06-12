"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import SlideBtn from "@/components/frontendcomponents/atoms/SlideBtn";
import { Autoplay, Navigation } from "swiper/modules";
import { useState } from "react";

const KeyIndustries = () => {
  const [swiper, setSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      id="industries"
      className="bg-background overflow-hidden py-9 md:py-12 lg:py-16 xl:py-20"
    >
      <div className="container grid grid-cols-1 gap-5 md:gap-10 lg:grid-cols-[343px_1fr]">
        <div className="order-2 flex flex-col justify-center lg:order-1">
          <Heading className="">Turnkey Solutions For</Heading>
          <p className="mt-2 mb-5 text-justify text-sm [word-spacing:-0.1rem] md:my-5 md:text-base">
            We provide end-to-end turnkey solutions from project planning,
            process and product validation, manufacturing process and
            engineering, and plant maintenance.
          </p>
          <Button className="w-fit" href="/turnkey-projects">
            View all industries
          </Button>
          <div className="mt-8 hidden items-center gap-3 lg:flex">
            <SlideBtn variant="tertiary" className="industry-button-prev" />
            <ul className="flex gap-3">
              {data.map((_, i) => {
                const isActive = activeSlide === i;
                return (
                  <li
                    className={`size-[9px] cursor-pointer rounded-full transition-all duration-300 ease-in-out ${isActive ? "bg-primary ring-primary ring-offset-background ring-1 ring-offset-6" : "bg-text/70"}`}
                    key={i}
                    onClick={() => {
                      setActiveSlide(i);
                      swiper?.slideToLoop(i);
                    }}
                  ></li>
                );
              })}
            </ul>
            <SlideBtn variant="tertiary" className="industry-button-next" />
          </div>
        </div>

        <div className="order-1 my-auto h-fit min-w-0 lg:order-2">
          <Slider
            className="overflow-visible! md:overflow-hidden! [&_.swiper-slide]:transition-all! [&_.swiper-slide]:duration-500! [&_.swiper-slide]:ease-in-out [&_.swiper-slide]:md:scale-70 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active>a]:opacity-100"
            data={data}
            loop={true}
            card="industry"
            isBtnVisible={false}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 1.9 },
            }}
            navigation={{
              prevEl: ".industry-button-prev",
              nextEl: ".industry-button-next",
            }}
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          />
        </div>
      </div>
    </section>
  );
};

export default KeyIndustries;

const data = [
  {
    image: "/image/industry/Cement-Plant.jpg",
    title: "Cement Projects",
    href: "/turnkey-projects/cement-plant",
  },
  {
    image: "/image/industry/Mineral-Processing.jpg",
    title: "Mineral Processing Plant",
    href: "/turnkey-projects/mineral-processing-unit",
  },
  {
    image: "/image/industry/Fertilizer-Plant.jpg",
    title: "Fertilizer Plant",
    href: "/turnkey-projects/fertilizer-plant",
  },
  {
    image: "/image/industry/Flue-Gas-Desulfurization-Plant.jpg",
    title: "Flue Gas Desulfurization (FGD) Plant",
    href: "/turnkey-projects/flue-gas-desulfurization-plant",
  },
  {
    image: "/image/trunkey/biomass-gasifier.png",
    title: "Biomass Gasifier",
    href: "/turnkey-projects/waste-to-energy-through-gasification",
  },
  {
    image: "/image/trunkey/msw-gasifier.jpg",
    title: "MSW Gasifier",
    href: "/turnkey-projects/waste-to-energy-through-gasification",
  },
  {
    image: "/image/industry/Lime-Processing-Plant.jpg",
    title: "Lime Processing Plant",
    href: "/turnkey-projects/lime-processing-plant",
  },
  {
    image: "/image/industry/plant-paper.jpg",
    title: "Paper Plants",
    href: "/turnkey-projects/paper-plants",
  },
  {
    image: "/image/industry/Contract-Manufacturing.jpg",
    title: "Contract Manufacturing",
    href: "/turnkey-projects/contract-manufacturing",
  },
  {
    image: "/image/trunkey/bulk-mineral-storage.png",
    title: "Bulk Material Storage, Packing and Loading",
    href: "/turnkey-projects/batching-plant",
  },
];


// const data = [
//   {
//     image: "/image/industry/Cement-Plant.jpg",
//     title: "Cement Plant",
//     href: "/products/cement-plant",
//   },
//   {
//     image: "/image/industry/Mineral-Processing.jpg",
//     title: "Mineral Processing Unit",
//     href: "/products/mineral-processing-unit",
//   },
//   {
//     image: "/image/industry/Fertilizer-Plant.jpg",
//     title: "Fertilizer Plant",
//     href: "/products/fertilizer-plant",
//   },
//   {
//     image: "/image/industry/Flue-Gas-Desulfurization-Plant.jpg",
//     title: "Flue Gas Desulfurization Plant",
//     href: "/products/flue-gas-desulfurization-plant",
//   },
//   {
//     image: "/image/industry/Waste-to-Energy-through-Gasification.jpg",
//     title: "Waste to Energy through Gasification",
//     href: "/products/waste-to-energy-through-gasification",
//   },
//   {
//     image: "/image/industry/Lime-Processing-Plant.jpg",
//     title: "Lime Processing Plant",
//     href: "/products/lime-processing-plant",
//   },
//   {
//     image: "/image/industry/plant-paper.jpg",
//     title: "Paper Plant",
//     href: "/products/paper-plants",
//   },
//   {
//     image: "/image/industry/Material-Handling-System.jpg",
//     title: "Material Handling System",
//     href: "/products/material-handling-system",
//   },
//   {
//     image: "/image/industry/Contract-Manufacturing.jpg",
//     title: "Contract Manufacturing",
//     href: "/products/contract-manufacturing",
//   },
//   {
//     image: "/image/industry/Batching-Plant.jpg",
//     title: "Batching Plant",
//     href: "/products/batching-plant",
//   },
// ];
