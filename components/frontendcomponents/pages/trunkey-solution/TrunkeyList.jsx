import ListCard from "@/components/frontendcomponents/molecules/ListCard";

import React from "react";

const TrunkeyList = ({ data }) => {
  return (
    <section id="turnkey-solution" className="bg-background pt-14 pb-20">
      <div className="container">
        <div className="grid grid-cols-3 gap-5">
          {data.map((item, index) => (
            <ListCard
              key={index}
              title={item.TypeName}
              image={item.Image1 ? `/OnlineImages/ClientTypeImages/${item.Image1}` : ""}
              descriptionTitle={item.ListHeading}
              description={item.ListDescription}
              link={`/${item.TypeNameURL}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default TrunkeyList;