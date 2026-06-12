"use client";

import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Navigation } from "swiper/modules";

const GroupCompanies = ({ otherCompanies = [] }) => {
  const data = otherCompanies.map((item) => ({
    id: item.CompanyID,
    title: item.CompanyName,
    description: item.SmallDescription,
    image: `/OnlineImages/CompanyImages/${item.CompanyImage}`,
    slug: `${item.CompanyNameURL}`,
  }));

  return (
    <section className="bg-primary py-14">
      <div className="container">
        <Heading className="text-center text-white">Group of Companies</Heading>
        <Slider
          className="mt-14 pb-10!"
          card="insight"
          name="company"
          modules={[Navigation]}
          data={data}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
        />
      </div>
    </section>
  );
};

export default GroupCompanies;