"use client"
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import { useState } from "react";

const ChooseDrive = ({ DriveData, drives = [] }) => {
  const [isActive, setIsActive] = useState(0);

  const topCards = drives.map((item) => ({
    icon: `/OnlineImages/ProductImages/${item.IconImage}`,
    title: item.Title,
    description: item.Tagline,
  }));

  const accData = drives.map((item) => ({
    id: item.DriveId,
    title: item.Title,
    description: item.Description,
    image: `/OnlineImages/ProductImages/${item.DefaultImage}`,
  }));

  return (
    <section id="choose-your-drive" className="bg-primary py-20">
      <div className="container">
        <Heading className="mb-2 text-center text-white">
          {DriveData?.Section6Title}
        </Heading>
        <div
          className="[&_p]:text-center  [&_p]:text-white"
          dangerouslySetInnerHTML={{ __html: DriveData?.Section6Description }}
        />

        {topCards.length > 0 && (
          <div className="mt-14 grid grid-cols-3 overflow-hidden rounded-md bg-[#3AA0CF] p-4">
            {topCards.map(({ icon, title, description }, idx) => (
              <div key={idx} className="border-white/20 px-8 py-4 not-last:border-r">
                <h3 className="mb-3 flex items-center gap-3">
                  <Image src={icon} alt={title} width={30} height={30} />
                  <span className="text-base text-white">{title}</span>
                </h3>
                <p className="text-white opacity-70">{description}</p>
              </div>
            ))}
          </div>
        )}

        {accData.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 md:gap-28 max-w-[85%] mx-auto">
            <ul className="border-l border-white pl-8 md:pl-12">
              {accData.map(({ title, description }, i) => {
                const isOpen = isActive === i;
                return (
                  <li
                    className="cursor-pointer not-last:pb-4 first:pt-4"
                    key={i}
                    onClick={() => setIsActive(i)}
                  >
                    <h3
                      className={`before:border-primary before:flex-center relative mb-2 text-lg font-semibold transition-all duration-500 ease-in-out before:absolute before:top-0 before:-left-11 before:flex before:h-[24px] before:w-[24px] before:items-center before:justify-center before:rounded-full before:border before:text-center before:transition-all before:duration-500 before:ease-in-out md:text-xl md:before:-left-16 md:before:h-[32px] md:before:w-[32px] ${!isOpen ? "before:text-primary text-white/70 before:bg-white before:text-2xl before:content-['+']" : "before:text-primary text-white before:bg-white before:content-['—']"}`}
                    >
                      {title}
                    </h3>
                    <div className={`grid ${isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr]"} transition-all duration-500 ease-in-out [&_p]:not-first:mt-2`}>
                      <div className="overflow-hidden text-justify text-base text-sm [&_h4]:mt-4 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-white text-white/80"> {description}</div>
                      {/* <div
                        className="overflow-hidden text-justify text-base text-sm [&_h4]:mt-4 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-white [&_p]:text-white/80"
                        dangerouslySetInnerHTML={{ __html: description }}
                      /> */}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div>
              {accData.map(({ image, title }, i) => {
                const isVisible = i === isActive;
                return (
                  <figure
                    key={i}
                    className={`oveflow-hidden relative overflow-hidden rounded-md transition-all duration-500 ease-in-out md:w-[531px] ${isVisible ? "h-[250px] translate-y-0 opacity-100 md:h-[381px]" : "h-0 translate-y-10 opacity-0"}`}
                  >
                    <Image
                      src={image}
                      className="h-full w-full object-cover transition-all duration-500 ease-in-out"
                      alt={title}
                      width={1920}
                      height={1080}
                    />
                  </figure>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChooseDrive;