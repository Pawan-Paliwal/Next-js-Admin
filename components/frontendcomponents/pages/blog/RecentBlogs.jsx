"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import SlideBtn from "@/components/frontendcomponents/atoms/SlideBtn";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Navigation } from "swiper/modules";

const RecentBlogs = ({ recentBlogs }) => {
  return (
    <section className="py-14">
      <div className="container">
        <Heading
          right={
            <div className="flex items-center gap-4">
              <SlideBtn className="insight-button-prev" />
              <SlideBtn className="insight-button-next" />
            </div>
          }
        >
          Latest Insights
        </Heading>

        <Slider
          className="mt-14 [&_.swiper-slide]:transition-all! [&_.swiper-slide]:duration-700! [&_.swiper-slide]:ease-in-out! [&_.swiper-slide-active]:w-[571px]! [&_.swiper-slide-active_figcaption]:pointer-events-auto! [&_.swiper-slide-active_figcaption]:opacity-100! [&_.swiper-slide-active>figure]:before:block"
          card="recentInsight"
          modules={[Navigation]}
          spaceBetween={16}
          loop={true}
          data={recentBlogs}
          isBtnVisible={false}
          navigation={{
            prevEl: ".insight-button-prev",
            nextEl: ".insight-button-next",
          }}
          breakpoints={{
            768: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4.01,
              spaceBetween: 24,
            },
          }}
        />
      </div>
    </section>
  );
};

export default RecentBlogs;