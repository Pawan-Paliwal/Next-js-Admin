import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import Article from "../../organisms/Article";
import GroupCompanies from "./GroupCompanies";

const Company = ({ companyData, MoreCompanies }) => {
  return (
    <>
      <Hero
        image={`/OnlineImages/CompanyImages/${companyData?.CompanyBannerImage}`}
        title={companyData?.CompanyName}
        description={companyData?.Tagline}
        scrollTo="#detail"
        variant="secondary"
      />
      <Article>
        <div dangerouslySetInnerHTML={{ __html: companyData?.Description }} />
      </Article>
      {MoreCompanies?.length > 0 && <GroupCompanies otherCompanies={MoreCompanies} />}
    </>
  );
};

export default Company;