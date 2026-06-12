"use client";
import PlayBtn from "@/components/frontendcomponents/atoms/PlayBtn";
import { useModal } from "@/hooks/useModal";

const Excellence = () => {
  const { openModal } = useModal();

  return (
    <section id="overview" className="bg-white py-9 md:py-14">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col justify-center">
          <h2 className="mb-3 max-w-[450px] text-2xl leading-normal font-bold md:mb-5 md:text-4xl">
            Committed to Engineering Excellence.
          </h2>
          <div>
            <p className="text-justify text-sm md:text-base">
              Chanderpur Group was initiated in 1962 with the first company,
              Chanderpur Works Pvt. Ltd, started by Shri Sumesh Chandra. Since
              that time, the Group has continued to grow its product range and
              footprint. Within the current global market, CPG boasts an
              extensive array of clients across almost every continent of the
              world, which indicates its dedication to excellence and
              innovation.{" "}
            </p>
            <h4 className="text-gray mt-5 mb-2 text-base font-semibold md:text-xl">
              Our Core Strength
            </h4>
            <ul className="marker:text-primary list-disc pl-8 text-sm md:text-base [&>li]:not-last:mb-1">
              <li>
                60+ years of expertise, 1500+ strong, and a perfect blend of
                experience and youth.
              </li>
              <li>Led by 3rd & 4th generation engineering entrepreneurs.</li>
              <li>
                A dynamic team of highly skilled mechanical, process, chemical,
                and industrial engineers.
              </li>
              <li>Trusted by top clients across all industries.</li>
            </ul>
          </div>
        </div>
        <figure className="relative h-[250px] w-full overflow-hidden rounded-md md:h-[360px]">
          <PlayBtn
            onClick={() => openModal("video")}
            className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          />

          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/video/about-poster.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </figure>
      </div>
    </section>
  );
};

export default Excellence;
