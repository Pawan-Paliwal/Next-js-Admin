"use client"
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import Directors from "./Directors";
import MileStone from "./MileStone";
import SocialResponsibility from "./SocialResponsibility";
import CompaniesGroup from "./CompaniesGroup";
import Awards from "./Awards";
import Foundation from "./Foundation";
import Excellence from "./Excellence";
import Collaborations from "./Collaborations";
import BottomNav from "@/components/frontendcomponents/molecules/BottomNav";
import { useGetAboutPageDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";

const About = () => {
  const { data, isLoading, isError } = useGetAboutPageDataQuery();
  if (isLoading) return <Loading />;
  const visibleTabs = tabs.filter((tab) => {
    switch (tab.path) {
      case "/about-us/#overview": return true;
      case "/about-us/#milestones": return data?.Milestonedata?.length > 0;
      case "/about-us/#foundation": return true;
      case "/about-us/#directors": return data?.directorData?.length > 0;
      case "/about-us/#companies": return data?.companyData?.length > 0;
      case "/about-us/#collaborations": return data?.collaborationData?.length > 0;
      case "/about-us/#awards": return data?.awardData?.length > 0;
      case "/about-us/#csr": return true;
      default: return true;
    }
  });

  return (
    <>

      <Hero
        className="[&_h1]:max-w-[800px]! [&_p]:max-w-[590px]! [&_p]:2xl:max-w-[690px]! "
        image="/image/about/banner.jpg"
        title="About Chanderpur Group"
        description="A History of 60+  Years of  Experience That's Grown into Trust, Innovation, and Partnerships That Lead to Positive Change."
        scrollTo="#overview"
      />
      <div className="bg-primary h-full pb-10">
        <Excellence />
        {data?.Milestonedata?.length > 0 && <MileStone MileStoneData={data?.Milestonedata} />}
        <Foundation />
        {data?.directorData?.length > 0 && <Directors DirectorData={data?.directorData} />}
        {data?.companyData?.length > 0 && <CompaniesGroup CompaniesGroupData={data?.companyData} />}
        {data?.collaborationData?.length > 0 && <Collaborations CollaborationsData={data?.collaborationData} />}
        {data?.awardData?.length > 0 && <Awards AwardData={data?.awardData} />}
        <SocialResponsibility />
        <BottomNav data={visibleTabs} />
      </div>
    </>
  );
};

export default About;

const tabs = [
  {
    label: "Overview",
    path: "/about-us/#overview",
  },
  {
    label: "Milestones",
    path: "/about-us/#milestones",
  },
  {
    label: "Strategic Framework",
    path: "/about-us/#foundation",
  },
  {
    label: "Directors",
    path: "/about-us/#directors",
  },
  {
    label: "Companies",
    path: "/about-us/#companies",
  },
  {
    label: "Collaborations",
    path: "/about-us/#collaborations",
  },
  {
    label: "Awards",
    path: "/about-us/#awards",
  },
  {
    label: "CSR",
    path: "/about-us/#csr",
  },
];