"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import { useState } from "react";

const Manufacturing = ({ manufacturingData }) => {
  const [currCard, setCurrCard] = useState(0);
  if (!manufacturingData) return null;
  const data = manufacturingData?.map((item) => ({
    title: item.ManufacturingName,
    image: `/image/home/machinery.svg`,
    video: `/OnlineImages/ManufacturingImages/${item.ManufacturingVideoUrl}`,
  })) || [];
  return (
    <section className="overlow-hidden py-9 md:py-12 lg:py-14">
      <div className="container">
        <Heading className="text-center">Where Manufacturing Begins</Heading>

        <div className="mt-8 flex flex-col items-center gap-6 md:mt-12 lg:mt-14 md:flex-row md:gap-4">
          {data.map(({ title, image, video }, i) => {
            const isActive = currCard === i;
            return (
              <figure
                onClick={() => setCurrCard(i)}
                key={i}
                className={`${isActive ? " md:flex-1" : "w-full md:w-[70px] lg:w-[128px]"} relative h-[250px] overflow-hidden rounded-md transition-all duration-500 ease-in-out before:absolute before:inset-0 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0)_100%)] before:transition-all before:duration-500 before:ease-in-out before:content-[''] md:h-[439px]`}
              >
                <video
                  className="size-full object-cover transition-all duration-500 ease-in-out"
                  autoPlay
                  muted
                  loop
                  src={video}
                  alt={title}
                  width={734}
                  height={439}
                />
                <figcaption
                  className={`font-red-hat-display absolute bottom-3 left-1/2 w-full -translate-x-1/2 p-4 text-center text-lg leading-[1.2] font-bold text-white md:bottom-6 md:text-2xl ${isActive
                    ? "opacity-100"
                    : " opacity-100 md:pointer-events-none md:opacity-0"
                    }`}
                >
                  {title}
                </figcaption>
                <figure
                  className={`flex-center absolute bottom-6 left-1/2 hidden size-[24px] -translate-x-1/2 rounded-full border border-white md:size-[36px] ${!isActive ? "md:flex" : "hidden"}`}
                >
                  <Image
                    src="/icon/plus.svg"
                    alt="plus"
                    width={16}
                    height={16}
                  />
                </figure>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Manufacturing;
