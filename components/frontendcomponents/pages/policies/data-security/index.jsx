import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import DataSecurityContent from "./DataSecurityContent";

const DataSecurity = () => {
  return (
    <>
      <Hero
        image="/image/policies/data-security.jpg"
        title="Data Security and Privacy Policy"
        description="Approach to Data Protection Emphasises Security, Privacy and Trust"
        scrollTo="#policies"
      />
      <DataSecurityContent />
    </>
  );
};

export default DataSecurity;
