import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import ChannelPartners from "./Partners";
import BusinessOpportunities from "./BusinessOpportunities";

const VendorOpportunity = () => {
  return (
    <>
      <Hero
        className="[&_p]:max-w-[500px]!"
        video="/video/vendors.mp4"
        title="Vendor Opportunities"
        description="Collaborate with CPG - discover vendor opportunities based on quality, reliability and consistency."
        scrollTo="/vendor-opportunities#detail"
      />
      <BusinessOpportunities />
      <ChannelPartners />
    </>
  );
};

export default VendorOpportunity;
