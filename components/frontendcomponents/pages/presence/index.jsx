import React from "react";
import Nations from "./Nations";
import PresenceIntro from "./PresenceIntro";
import WorldMap from "./WorldMap";
import PresenceHero from "./PresenceHero";

const Presence = () => {
  return (
    <>
      <PresenceHero />
      <PresenceIntro />
      <WorldMap />
      <Nations />
    </>
  );
};

export default Presence;