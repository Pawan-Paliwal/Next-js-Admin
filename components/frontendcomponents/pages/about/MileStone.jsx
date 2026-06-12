"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import React, { useEffect, useState, useRef } from "react";
import { Navigation } from "swiper/modules";

const MileStone = ({ MileStoneData }) => {
  const [activeYear, setActiveYear] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const yearListRef = useRef(null);
  const yearItemRefs = useRef([]);
  if (!MileStoneData) return null;

  const data = [...(MileStoneData ?? [])]
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      id: item.MilestoneID,
      year: item.MilestoneYear,
      name: item.MilestoneName,
      message: item.Description?.replace(/<[^>]*>/g, "") ?? "",
      image: `/OnlineImages/MilestoneImages/${item.MilestoneImage}`,
    }));

  useEffect(() => {
    yearItemRefs.current[activeYear]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeYear]);

  return (
    <section id="milestones" className="bg-background py-9 md:py-14">
      <Heading className="text-center">Milestones</Heading>
      <div className="border-primary mt-10 border-t md:mt-14">
        <div className="container mt-[-12px] overflow-auto scroll-smooth p-3 [&::-webkit-scrollbar]:hidden">
          <ul className="flex items-center gap-[50px] md:gap-[91px]" ref={yearListRef}>
            {data.map(({ year, id }, i) => {
              const isActive = activeYear >= i;
              return (
                <li
                  ref={(el) => (yearItemRefs.current[i] = el)}
                  onClick={() => {
                    swiper?.slideTo(i);
                    setActiveYear(i);
                  }}
                  className={`cursor-pointer transition-all duration-300 ease-in-out ${isActive
                    ? "text-primary before:bg-primary before:border-primary"
                    : "before:border-text before:bg-white"
                    } relative pt-5 text-base md:text-lg before:absolute before:-top-[8px] md:before:-top-[10px] before:left-1/2 before:size-[14px] md:before:size-[18px] before:-translate-x-1/2 before:rounded-full before:border before:content-['']`}
                  key={id}
                >
                  {year}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="container mt-8 md:mt-14">
        <Slider
          className="max-w-[90%]"
          modules={[Navigation]}
          data={data}
          card="milestone"
          loop={true}
          slidesPerView={1}
          btnVariant="secondary"
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveYear(swiper.activeIndex)}
        />
      </div>
    </section>
  );
};

export default MileStone;