import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import TrunkeyOverview from "./TrunkeyOverview";
import TurnkeyClients from "./TurnkeyClients";
import TrunkeySuggestion from "./TrunkeySuggestion";

const TrunkeyDetail = ({ turnkeyProject, partnerLogos }) => {
  if (!turnkeyProject) return null;

  return (
    <>
      {turnkeyProject?.BannerImage && (
        <Hero
          image={`/OnlineImages/ClientTypeImages/${turnkeyProject.BannerImage}`}
          title={turnkeyProject.TypeName}
          description={turnkeyProject.SmallDescription}
          scrollTo="#overview"
        />
      )}
      {(turnkeyProject?.Description || turnkeyProject?.Image1) && (
        <TrunkeyOverview turnkeyProject={turnkeyProject} />
      )}
      {(turnkeyProject?.ListDescription || turnkeyProject?.ProductDescription) && (
        <TrunkeySuggestion turnkeyProject={turnkeyProject} />
      )}
      {partnerLogos?.length > 0 && (
        <TurnkeyClients partnerLogos={partnerLogos} />
      )}
    </>
  );
};

export default TrunkeyDetail;