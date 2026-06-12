"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Navigation } from "swiper/modules";

const Directors = ({ DirectorData }) => {
  const data = [...(DirectorData ?? [])]
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      id: item.DirectorID,
      image: `/OnlineImages/DirectorImages/${item.DirectorImage}`,
      name: item.DirectorName,
      designation: item.DirectorDesignation,
      about: item.DirectorBio ?? "",
    }));

  return (
    <section id="directors" className="bg-white py-9 md:py-14">
      <div className="container">
        <Heading className="text-center">Board of Directors</Heading>

        <Slider
          className="mt-8 md:mt-12 overflow-visible! md:overflow-hidden!"
          data={data}
          slidesPerView={1.2}
          card="director"
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        />
      </div>
    </section>
  );
};

export default Directors;