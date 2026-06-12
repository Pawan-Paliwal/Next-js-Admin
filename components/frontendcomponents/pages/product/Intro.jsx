import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React from "react";

const Intro = () => {
  return (
    <section className="relative py-14">
      <div className="container">
        {/* <figure className=" mb-5 w-fit mx-auto">
          <Image src="/icon.svg" alt="icon" width={74} height={74} />
        </figure> */}
        <Heading className="mb-4 text-center">Products</Heading>
        <p className="text-text mx-auto max-w-[950px]  text-base">
          We provide turnkey plant solutions as well as an extensive line of
          industrial machinery and process equipment such as Continuous Ball
          Mills, Rotary Kilns, Material Handling Systems and other mineral
          processing equipment. We produce our goods according to the
          international standards of industry, with modern engineering
          technology, with accuracy of fabrication and the best raw materials.
          We also offer tailored engineering solutions based on client
          specifications to achieve efficient operations, reliability, and high
          performance.
        </p>
      </div>
    </section>
  );
};

export default Intro;
