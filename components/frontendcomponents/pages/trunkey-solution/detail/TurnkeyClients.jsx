import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React from "react";

const TurnkeyClients = ({ partnerLogos }) => {
  return (
    <section className="bg-primary py-16">
      <div className="container">
        <Heading className="mb-3 text-center text-white">Our Clients</Heading>
        <p className="text-center text-white">
          Strengthening Businesses Through Trusted Partnerships
        </p>

        <div className="mt-14 grid grid-cols-5 gap-6">
          {partnerLogos?.map((item) => {
            return (
              <figure
                className="flex h-35.5 items-center justify-center overflow-hidden rounded-md bg-white p-5"
                key={item.PartnerLogoID}
              >
                <Image
                  className="h-full w-auto"
                  src={`/OnlineImages/PartnerLogos/${item.PartnerLogoImage}`}
                  alt={`Partner ${item.PartnerLogoID}`}
                  width={200}
                  height={200}
                />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TurnkeyClients;