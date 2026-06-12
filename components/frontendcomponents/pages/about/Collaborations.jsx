"use client";
import React from "react";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import SlideBtn from "@/components/frontendcomponents/atoms/SlideBtn";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { EffectCards, Navigation, Pagination } from "swiper/modules";

function Collaborations({ CollaborationsData }) {
  if (!CollaborationsData) return null;

  const data = [...(CollaborationsData ?? [])]
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      id: item.CollaborationID,
      title: item.CollaborationName,
      description: item.Description ?? "",
      logo: `/OnlineImages/CollaborationImages/${item.CollaborationImage}`,
      link: `/collaborations/${item.CollaborationNameURL}`,
    }));

  return (
    <section
      id="collaborations"
      className="overflow-hidden bg-white pt-9 pb-12 md:pt-14 md:pb-20"
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_553px] md:gap-28">
          <div className="flex flex-col justify-center">
            <Heading className="text-center text-black md:text-left">
              Collaborations
            </Heading>
            <p className="text-text mt-5 max-w-[448px] text-justify text-sm md:text-base">
              At Chanderpur Group (CPG), we believe in continuous innovation and
              global partnerships to bring the best technology and expertise to
              the industries we serve. Over the years, we have built strategic
              alliances with leading international companies to enhance our
              product offerings and provide cutting-edge solutions.
            </p>
            <div className="flex items-center justify-end gap-3 md:mt-8">
              <SlideBtn className="swiper-prev-collab" />
              <SlideBtn className="swiper-next-collab" />
            </div>
          </div>
          <Slider
            className="[&_.swiper-pagination]:bg-primary/20! [&_.swiper-pagination-progressbar-fill]:bg-primary! max-h-[560px]! overflow-visible! [&_.swiper-pagination]:top-auto! [&_.swiper-pagination]:bottom-[97px]! [&_.swiper-pagination]:-left-[675px]! [&_.swiper-pagination]:w-[77%]! 2xl:[&_.swiper-pagination]:bottom-[107px]! [&_.swiper-slide-shadow]:bg-transparent!"
            effect={"cards"}
            data={data}
            modules={[Navigation, Pagination, EffectCards]}
            navigation={{
              prevEl: ".swiper-prev-collab",
              nextEl: ".swiper-next-collab",
            }}
            paginationType="progressbar"
            isBtnVisible={false}
            card="collabration"
            slidesPerView={1}
          />
        </div>
      </div>
    </section>
  );
}

export default Collaborations;