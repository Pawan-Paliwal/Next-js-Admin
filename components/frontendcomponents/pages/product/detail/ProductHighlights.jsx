"use client"
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import React from "react";
import { Navigation } from "swiper/modules";

const ProductHighlights = ({ highlight }) => {
  const data = highlight.map((item) => item.Title);
  return (
    <section id="highlight" className="bg-primary py-16">
      <div className="container">
        <Heading className="text-center text-white">Key Highlights</Heading>

        <Slider
          className="mt-16"
          slidesPerView={3}
          spaceBetween={20}
          data={data}
          card="productHighlight"
          modules={[Navigation]}
        />
      </div>
    </section>
  );
};

export default ProductHighlights;
