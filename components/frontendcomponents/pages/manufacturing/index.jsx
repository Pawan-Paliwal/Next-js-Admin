'use client';
import Detail from "@/components/frontendcomponents/organisms/Detail";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import SectionIntro from "./SectionIntro";
import { useGetActiveFacilityCategoryQuery } from "@/store/backendSlice/facilityCategoryAPISlice";
import Loading from "@/app/loading";
const ManufacturingFacilities = () => {
  const { data: activeCategories, isLoading } = useGetActiveFacilityCategoryQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        className=" [&_h1]:max-w-[750px]! [&_p]:max-w-[550px]!"
        title="Manufacturing Facilities"
        description="Engineering Superiority At Work, World-Class Manufacturing, Machining & Fabrication Facilities."
        video="/video/manufacturing-facility.mp4"
        scrollTo="/manufacturing-facilities#detail"
      />
      <Detail
        id="detail"
        data={
          <>
            <p>
              It’s been more than 60 years, since we are active in engineering,
              developing, and manufacturing world-class products for out
              customers
            </p>
            <p>
              We have a track record of upgrading and raising the standard of
              quality in our product line so that it gets an edge over others in
              terms of efficiency and life span. For years, we have been
              manufacturing products with international standards and for this;
              we have been accredited with ISO 9001 certificate.
            </p>
            <p>
              Besides this, we have also shown our credibility in the industry
              with our CE-marked CPG products. In order to manufacture the
              products with flawless quality, we have wisely adopted to various
              advanced solutions to reduce even a single glitch that can later
              affect the product performance
            </p>
          </>
        }
      />
      {activeCategories.length > 0 && <SectionIntro activeCategories={activeCategories} />}
    </>
  );
};

export default ManufacturingFacilities;
