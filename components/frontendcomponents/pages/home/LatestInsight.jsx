"use client";

import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Navigation } from "swiper/modules";

const LatestInsight = ({ title, blogData }) => {
  if (!blogData) return null;
  const data = blogData?.map((item) => ({
    title: item.BlogName,
    image: `/OnlineImages/BlogImages/${item.BlogImage}`,
    date: item.PostedDate,
    slug: item.BlogNameURL,
  })) || [];
  return (
    <section className="overflow-hidden bg-[#f5f5f5] py-9 md:py-12 lg:py-14">
      <div className="container">
        <Heading className="text-center">{title || "Latest Insights"}</Heading>

        <Slider
          className="mt-9! overflow-visible! md:mt-12! md:overflow-hidden! md:pb-10! lg:mt-14!"
          card="insight"
          modules={[Navigation]}
          data={data}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            768: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 2.7,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
        />
      </div>
    </section>
  );
};

export default LatestInsight;
