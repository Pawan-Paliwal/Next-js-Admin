import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React from "react";

const WhyChoose = () => {
  return (
    <section className="bg-background py-16">
      <div className="container">
        <Heading className="text-center">Why Choose CPG</Heading>
        <div className="mx-auto mt-16 grid max-w-[991px] grid-cols-2 gap-16 ">
          <figure className="h-[372px] overflow-hidden rounded-md">
            <Image
              className="size-full object-cover"
              alt="why choose cpg"
              src="/image/career/meeting.jpg"
              width={1920}
              height={1080}
            />
          </figure>

          <div className="pl-8 border-l border-primary">
            <ul className="space-y-4">
              {data.map(({ title, description }, index) => {
                return <li key={index} className="first:pt-6 last:pb-20 ">
                  <h4 className="text-gray relative before:absolute before:content-[] before:left-[-40px] before:top-1.5  before:size-[15px] before:rounded-full  before:bg-primary font-semibold mb-1">{title}</h4>
                  <p>{description}</p>
                </li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;

const data = [
  {
    title: "Purpose Driven Work",
    description:
      "You get the opportunity to work on cement, minerals and heavy engineering projects-industries that are the pillars of infrastructure and development.",
  },
  {
    title: "Purpose Driven Work",
    description:
      "You get the opportunity to work on cement, minerals and heavy engineering projects-industries that are the pillars of infrastructure and development.",
  },
  {
    title: "Purpose Driven Work",
    description:
      "You get the opportunity to work on cement, minerals and heavy engineering projects-industries that are the pillars of infrastructure and development.",
  },
];
