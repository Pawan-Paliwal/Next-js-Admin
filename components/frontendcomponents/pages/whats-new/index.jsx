"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import WhatsList from "./WhatsList";
import { useGetWhatsNewPageDataQuery } from "@/store/frontendSlice/homePageAPISlice";

const WhatsNew = () => {
  const { data, isLoading, error } = useGetWhatsNewPageDataQuery();

  return (
    <>
      <Hero
        image="/image/new/banner.png"
        title="What's New"
        description="The Latest in Engineering Excellence, Updated in Real-time from Our Global Projects."
        scrollTo="/whats-new/#article"
      />
      {data?.whatsNewData?.length > 0 && <WhatsList whatsNewData={data.whatsNewData} />}
    </>
  );
};

export default WhatsNew;