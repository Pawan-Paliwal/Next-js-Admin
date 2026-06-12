import Heading from "@/components/frontendcomponents/atoms/Heading";
import Detail from "@/components/frontendcomponents/organisms/Detail";
import Image from "next/image";
import React from "react";

const ChannelPartners = () => {
  return (
    <section className="bg-background pt-20">
      <div className="container">
        <Heading className="text-center">Channel Partners</Heading>
        <Detail
          className="pt-10"
          data={
            <>
              <p>
                For ensuring wider market presence and to provide professional
                support to our customers across geographical locations, we have
                partnered with several well established companies that are
                allowed to offer services on our behalf. We have outsourced work
                to our channel partners and ensure that customers receive best
                services and highest levels of satisfaction is guaranteed.
              </p>
              <p>
                We have a sharp focus on expansing our operations with execution
                of projects across locations. Hence, we have appointed and are
                also looking forward to appoint Channel Partners for outsourcing
                the following activities :
              </p>
            </>
          }
        />
      </div>

      <div className="bg-primary py-16">
        <div className="container grid grid-cols-4 gap-5">
          {data?.map(({ title, icon }) => {
            return (
              <figure
                key={title}
                className="flex-center flex-col overflow-hidden px-10 py-6.5 gap-4 rounded-md bg-white"
              >
                <Image src={icon} width={48} height={48} alt={title} />
                <p className="text-primary text-center">{title}</p>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChannelPartners;

const data = [
  {
    icon: "/icon/helemet.svg",
    title: "Civil Designing",
  },
  {
    icon: "/icon/search-blue.svg",
    title: "Inspection service",
  },
  {
    icon: "/icon/thunder.svg",
    title: "Supply of Electrical",
  },
  {
    icon: "/icon/twer.svg",
    title: "Erection & Commissioning of sub-stations etc.",
  },
  {
    icon: "/icon/note-book.svg",
    title: "Electrical Designing",
  },
  {
    icon: "/icon/clip.svg",
    title: "Raw Material testing",
  },
  {
    icon: "/icon/meter.svg",
    title: "Engineering Drawings",
  },
  {
    icon: "/icon/stats.svg",
    title: "Project Feasibility report",
  },
];
