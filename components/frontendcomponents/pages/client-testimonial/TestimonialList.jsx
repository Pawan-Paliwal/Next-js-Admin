"use client";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Autoplay, FreeMode } from "swiper/modules";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const TestimonialList = ({ testimonialData }) => {
  const data = testimonialData
    ?.slice()
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      company: item.TestimonialName,
      review: item.TestimonialDescription,
      logo: `/OnlineImages/TestimonialImages/${item.TestimonialImage}`,
    }));

  const firstHalf = data?.slice(0, Math.ceil(data?.length / 2));
  const secondHalf = data?.slice(Math.ceil(data?.length / 2));

  return (
    <section className="py-14" id="list">
      <div className="container">
        <div className="grid grid-cols-2 gap-4">
          <Slider
            data={[...firstHalf, ...firstHalf]}
            card="clientTestimonial"
            loop={true}
            isBtnVisible={false}
            slidesPerView="auto"
            direction="vertical"
            centeredSlides={true}
            speed={3200}
            spaceBetween={20}
            modules={[Autoplay, FreeMode]}
            className="h-[600px] overflow-hidden [&_.swiper-slide]:h-fit! [&_.swiper-wrapper]:[animation-timing-function:linear]"
            initialSlide={firstHalf.length}
            loopAdditionalSlides={firstHalf.length}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
          />
          <Slider
            data={[...secondHalf, ...secondHalf]}
            card="clientTestimonial"
            loop={true}
            isBtnVisible={false}
            slidesPerView="auto"
            direction="vertical"
            centeredSlides={true}
            speed={3200}
            spaceBetween={20}
            modules={[Autoplay, FreeMode]}
            className="h-[600px] overflow-hidden [&_.swiper-slide]:h-fit! [&_.swiper-wrapper]:[animation-timing-function:linear]"
            initialSlide={secondHalf.length}
            loopAdditionalSlides={secondHalf.length}
            freeMode={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialList;