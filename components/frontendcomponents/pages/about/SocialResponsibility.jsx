"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React, { useState } from "react";

const SocialResponsibility = () => {
  const [isActive, setIsActive] = useState(0);

  return (
    <section id="csr" className="bg-primary py-9 md:py-14">
      <div className="container">
        <Heading className="text-center text-white">
          Social Responsibility
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-14">
          <div>
            {data?.map(({ image }, i) => {
              const isVisible = i === isActive;
              return (
                <figure
                  key={i}
                  className={`oveflow-hidden relative overflow-hidden rounded-md transition-all duration-500 ease-in-out md:w-[531px] ${isVisible ? "h-[250px] translate-y-0 opacity-100 md:h-[381px]" : "h-0 translate-y-10 opacity-0"}`}
                >
                  <Image
                    src={image}
                    className="h-full w-full object-cover transition-all duration-500 ease-in-out"
                    alt=""
                    width={1080}
                    height={1920}
                  />
                </figure>
              );
            })}
          </div>

          <ul className="border-l border-white pl-8 md:pl-12">
            {data.map(({ title, description }, i) => {
              const isOpen = isActive === i;
              return (
                <li
                  className={`cursor-pointer not-last:pb-4 first:pt-4`}
                  key={i}
                  onClick={() => {
                    setIsActive(i);
                  }}
                >
                  <h3
                    className={`before:border-primary before:flex-center relative mb-2 text-lg font-semibold transition-all duration-500 ease-in-out before:absolute before:top-0 before:-left-11 before:flex before:h-[24px] before:w-[24px] before:items-center before:justify-center before:rounded-full before:border before:text-center before:transition-all before:duration-500 before:ease-in-out md:text-xl md:before:-left-16 md:before:h-[32px] md:before:w-[32px] ${!isOpen ? "before:text-primary text-white/70 before:bg-white before:text-2xl before:content-['+']" : "before:text-primary text-white before:bg-white before:content-['—']"}`}
                  >
                    {title}
                  </h3>
                  <div
                    className={`grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-500 ease-in-out [&_p]:not-first:mt-2`}
                  >
                    <div
                      className="overflow-hidden text-justify text-base text-sm [&_h4]:mt-4 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-white [&_p]:text-white/80"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SocialResponsibility;

const data = [
  {
    id: 1,
    title: "Charitable Hospital",
    description:
      "<p>Chanderpur Group is committed to its social responsibility and has been contributing to community healthcare since 1974. The promoters run Shri Suresh Chandra Memorial Charitable Eye & General Hospital, a charitable hospital in Yamunanagar, Haryana.</p><p>The hospital has 50 beds and provides all essential eye care services and operations. It is fitted to perform eye surgeries such as cataract operations and eye transplant procedures.</p><p>The hospital focuses on providing affordable treatment and accessible healthcare to the community.</p>",
    image: "/image/about/hospital.jpg",
  },
  {
    id: 2,
    title: "Charitable Library",
    description:
      "<p>Chanderpur Group also runs a charitable institute for students from underprivileged backgrounds, supporting them in both school and higher studies. The aim is simple - to make education more accessible by providing books and reading material across a range of subjects.</p><p>Additionally, the Group actively supports environmental initiatives. It regularly contributes to tree plantation drives in Yamunanagar and takes special care for “Greenery” within its campus, that leads to reflect its commitment to a cleaner and healthier environment.</p>",
    image: "/image/about/library.jpg",
  },
  {
    id: 3,
    title: "Renewable Energy Segment",
    description:
      "<P>Chanderpur Group has stepped into the renewable energy space to push for sustainable development and tackle climate change. We are taking on village electrification projects, rolling out Biomass Gasification Technology on a turnkey basis. With these efforts, the company is backing clean energy and making rural electrification more practical and easier to scale.</P>  <h4>Solar System Greens Initiative </h4>  <p>Our emphasis on sustainable energy at Chanderpur Group is through the installation of 1500 kW Solar Panels in our three manufacturing plants. This is one of the steps we are undergoing in our quest to incorporate renewable energy in our day-to-day processes. The solar systems will produce approximately 1,02,000 units of clean electricity each month and contribute to our energy demands more efficiently and responsibly. </p><p>To give this a context, solar power produces the same amount of electricity as approximately 700 homes can produce monthly. The change would help us to mitigate our carbon footprint as well as to support clean energy, energy efficiency, and environmentally friendly manufacturers. With such an initiative, we are still moving steadily towards being sustainable in operations and are much more concerned with the environment with regard to industrial growth.</p>",
    image: "/image/about/Renewable-Energy.jpg",
  },
];
