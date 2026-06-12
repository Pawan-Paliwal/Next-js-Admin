"use client";
import Detail from "@/components/frontendcomponents/organisms/Detail";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import WhyChoose from "./WhyChoose";
import Opening from "./Opening";
import OpeningModal from "./OpeningModal";
import { useGetCareerDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";

const Career = () => {
  const { data, isLoading, error } = useGetCareerDataQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        title="Career with CPG"
        description="Grow Beyond Limits With CPG"
        image="/image/career/banner.jpg"
        scrollTo="/career/#detail"
      />
      <Detail
        data={
          <>
            <p>
              At CPG, work is not about delivering projects but creating
              long-term value for industries and the people behind them.
            </p>
            <p>
              At CPG, experience is a source of career. The workplace is simple,
              cooperative and learning-oriented. Individuals collaborate, share
              knowledge and ownership of their work. This creates confidence and
              ability over a period.
            </p>
            <p>
              As a turnkey plant supplier, we also help our clients to develop
              their teams. We also offer advisory services related to
              recruitment in addition to engineering solutions in ensuring our
              customers find the right individual to work in their plants.
            </p>
            <p>
              We aid in the recruitment of any kind of manpower, such as
              semi-skilled and skilled technicians, chemists, electrical and
              civil engineers, maintenance, process, and environmental
              engineers, among others. This engagement lets us contribute more
              than machinery to the teams that do the running of these
              operations.
            </p>
          </>
        }
      />
      <WhyChoose />
      {data?.careerData?.length > 0 && (
        <Opening careerData={data.careerData} />
      )}
      <OpeningModal />
    </>
  );
};

export default Career;