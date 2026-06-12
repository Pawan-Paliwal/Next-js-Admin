import Heading from "@/components/frontendcomponents/atoms/Heading";
import React from "react";

const Standards = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container grid grid-cols-2 gap-20">
        <figure className="max-h-[500px] overflow-hidden rounded-md">
          <video
            className="size-full object-cover"
            src="/video/Manufacturing 2.mp4"
            autoPlay
            muted
            loop
            playsInline
          ></video>
        </figure>
        <div>
          <h2 className="text-white text-4xl leading-[1.2] font-bold">
            We are committed to maintaining the highest standards of quality,
            which shall be achieved through
          </h2>

          <div className="my-6">
            <ul className="border-l border-white h-full">
              {data.map((item, index) => (
                <li
                  className="relative pl-6 text-white not-first:mt-3 last:pb-4 before:absolute before:size-[14px] before:rounded-full before:border before:border-white before:-left-[7px] before:top-1 before:bg-primary"
                  key={index}
                >
                  {item}
                </li>

              ))}
            </ul>
          </div>

          <p className="max-w-[520px] text-white">
            Through these efforts, CPG continues to uphold excellence,
            reliability, and long-term value for its customers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Standards;

const data = [
  "Delivering consistent, high-quality products on time",
  "Driving innovation and technological advancement",
  "Continuous training and development of our workforce",
  "Ongoing improvement in quality systems and operations",
  "Ensuring compliance with all applicable requirements",
];
