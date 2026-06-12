"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import React, { useState } from "react";
import Slider from "@/components/frontendcomponents/molecules/Slider";

const Foundation = () => {
  const [activeFoundation, setActiveFoundation] = useState(0);
  const [swiper, setSwiper] = useState(null);

  return (
    <section
      id="foundation"
      className="bg-primary overflow-hidden pt-10 md:pt-14"
    >
      <div className="container">
        <Heading className="text-center text-white">
          Our Strategic Framework
        </Heading>

        <ul className="mt-5 flex items-center justify-center gap-10 md:mt-10">
          {[
            { title: "Vision", index: 0 },
            { title: "Mission", index: 1 },
            { title: "Values", index: 2 },
          ].map(({ title, index }) => {
            const isActive = activeFoundation === index;

            return (
              <li
                key={index}
                onClick={() => {
                  swiper.slideToLoop(index);
                  setActiveFoundation(index);
                }}
                className={`relative cursor-pointer pb-2 text-base text-white before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-left before:bg-white before:transition-all before:duration-300 before:ease-in-out before:content-[''] md:text-xl ${isActive
                    ? "opacity-100 before:scale-x-100"
                    : "opacity-70 before:scale-x-0"
                  }`}
              >
                {title}
              </li>
            );
          })}
        </ul>

        <div className="relative mt-10 md:mt-14">
          <svg
            className="absolute top-40 left-1/2 hidden -translate-x-1/2 md:block"
            width="1549"
            height="1549"
          >
            <circle
              cx="774.5"
              cy="774.5"
              r="774"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="12 12"
            />
          </svg>
          {
            <Slider
              className="pb-10! md:px-14! [&_.swiper-slide]:scale-80 [&_.swiper-slide]:opacity-0 [&_.swiper-slide]:transition-all! [&_.swiper-slide]:duration-500! [&_.swiper-slide]:ease-in-out! [&_.swiper-slide]:will-change-transform [&_.swiper-slide-active]:translate-y-0! [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:rotate-0 [&_.swiper-slide-active]:opacity-100! [&_.swiper-slide-active_h3]:opacity-100 [&_.swiper-slide-active_p]:opacity-100 [&_.swiper-slide-next]:translate-y-28 [&_.swiper-slide-next]:rotate-20! [&_.swiper-slide-next]:opacity-100! [&_.swiper-slide-next_img]:mt-14 [&_.swiper-slide-next_img]:size-[88.55px] [&_.swiper-slide-next_img]:opacity-40 [&_.swiper-slide-next_img]:brightness-0 [&_.swiper-slide-next_img]:invert-100 [&_.swiper-slide-next>div]:bg-[#3FA5D4]! [&_.swiper-slide-prev]:translate-y-28! [&_.swiper-slide-prev]:-rotate-20! [&_.swiper-slide-prev]:opacity-100! [&_.swiper-slide-prev_img]:mt-14 [&_.swiper-slide-prev_img]:size-[88.55px] [&_.swiper-slide-prev_img]:opacity-40 [&_.swiper-slide-prev_img]:brightness-0 [&_.swiper-slide-prev_img]:invert-100 [&_.swiper-slide-prev>div]:bg-[#3FA5D4]!"
              card="foundation"
              isBtnVisible={false}
              loop={true}
              slidesPerView={1.2}
              initialSlide={0}
              centeredSlides={true}
              centeredSlidesBounds={true}
              data={data}
              spaceBetween={20}
              onSwiper={setSwiper}
              onSlideChange={(swiper) =>
                setActiveFoundation(swiper.realIndex % 3)
              }
              breakpoints={{
                0: { slidesPerView: 1.2, spaceBetween: 50 },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
                1024: { slidesPerView: 3 },
              }}
            />
          }
        </div>
      </div>
    </section>
  );
};

export default Foundation;

const data = [
  {
    img: "/icon/bulb.svg",
    title: "Our Vision",
    description:
      "“Globally Preferred Engineering Conglomerate – An Inspiration of Speed, Ethics, Culture and Value Engineering.”",
  },
  {
    img: "/icon/goal.svg",
    title: "Our Mission",
    description:
      "To deliver intelligent, value-driven engineering solutions that exceed customer expectations, employee job satisfaction while fostering trust, safety, and sustainable growth for all stakeholders.",
  },
  {
    img: "/icon/handshake.svg",
    title: "Our Values",
    description:
      "Integrity, customer-first thinking, innovation, collaboration, and a deep commitment to people and sustainability.",
  },
  {
    img: "/icon/bulb.svg",
    title: "Our Vision",
    description:
      "“Globally Preferred Engineering Conglomerate – An Inspiration of Speed, Ethics, Culture and Value Engineering.”",
  },
  {
    img: "/icon/goal.svg",
    title: "Our Mission",
    description:
      "To deliver intelligent, value-driven engineering solutions that exceed customer expectations, employee job satisfaction while fostering trust, safety, and sustainable growth for all stakeholders.",
  },
  {
    img: "/icon/handshake.svg",
    title: "Our Values",
    description:
      "Integrity, customer-first thinking, innovation, collaboration, and a deep commitment to people and sustainability.",
  },
];
