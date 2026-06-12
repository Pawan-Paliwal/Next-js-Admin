"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import { useModal } from "@/hooks/useModal";
import React from "react";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Navigation } from "swiper/modules";
import SlideBtn from "@/components/frontendcomponents/atoms/SlideBtn";

const ProductTech = ({ productTechData, technology = [] }) => {
  const { openModal } = useModal();

  const data = technology.map((item) => ({
    title: item.Title,
    detail: item.Description,
    image: `/OnlineImages/ProductImages/${item.ImageUrl}`,
  }));

  return (
    <section id="technology" className="bg-background py-20">
      <div className="container grid grid-cols-[471px_1fr] gap-20">
        <div>
          <Heading>{productTechData?.Section5Title}</Heading>
          <div className="my-6 [&_p]:not-last:mb-4">
            <div dangerouslySetInnerHTML={{ __html: productTechData?.Section5Description }} />
          </div>
          <Button onClick={() => openModal("enquire")}>Enquire Now</Button>
        </div>

        <div className="relative">
          <div className="absolute right-16 top-1.5 z-2 flex items-center w-fit gap-3 md:mt-8">
            <SlideBtn className="swiper-prev-tech" />
            <SlideBtn className="swiper-next-tech" />
          </div>
          {data.length > 0 && (
            <Slider
              loop={true}
              isBtnVisible={false}
              slidesPerView={1}
              direction="vertical"
              centeredSlides={true}
              spaceBetween={20}
              modules={[Navigation]}
              navigation={{
                nextEl: ".swiper-next-tech",
                prevEl: ".swiper-prev-tech",
              }}
              data={data}
              card="techCard"
              className="[&_.swiper-slide-active_.content]:bg-primary h-119.5 [&_.swiper-slide-active_.detail_ul>li]:text-white/70 [&_.swiper-slide-active_.title]:text-white"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductTech;