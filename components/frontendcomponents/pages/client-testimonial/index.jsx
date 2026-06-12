"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import TestimonialList from "./TestimonialList";
import { useGetTestimonialDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";
const ClientTestimonial = () => {
  const { data, isLoading, error } = useGetTestimonialDataQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        video="/video/handshake.mp4"
        title="Client Testimonials"
        description="Client's voice is our brand promise, engineering trusted by the industry."
        scrollTo="#list"
      />
      {data?.testimonialData?.length > 0 && (
        <TestimonialList testimonialData={data.testimonialData} />
      )}
    </>
  );
};

export default ClientTestimonial;