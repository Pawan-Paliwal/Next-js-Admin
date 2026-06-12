"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import ClientStat from "./ClientStat";
import ClientList from "./ClientList";
import { useGetClientPageDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";

const OurClient = () => {
  const { data, isLoading, error } = useGetClientPageDataQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        className=" [&_p]:max-w-[550px]!"
        video="/video/client.mp4"
        title="Our Clients"
        description="We are measured by our client's trust, results and long-term relationships across sectors across the globe"
        scrollTo="#detail"
      />
      <ClientStat />
      {data?.clientData?.length > 0 && <ClientList clientData={data.clientData} />}
    </>
  );
};

export default OurClient;

