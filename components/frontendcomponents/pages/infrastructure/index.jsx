import Detail from "@/components/frontendcomponents/organisms/Detail";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import Image from "next/image";
import Highlights from "./Highlights";
import InfraCapabilities from "./InfraCapabilities";
import InfraVideo from "./InfraVideo";

const Infrastructure = () => {
  return (
    <>
      <Hero
        className="[&_h1]:max-w-[550px]! [&_p]:max-w-[600px]!"
        title="Expert and efficient solutions"
        description="We believe in providing world-class machining facilities"
        video="/video/infra.mp4"
        scrollTo="/in-house-infrastructure#infra"
      />
      <Detail
        id="infra"
        data={
          <>
            <p>
              CPW nurtures a healthy base of 300 talented persons including
              Engineers, Technicians, Managers and Workmen with expertise in
              various disciplines such as mechanical, electrical,
              instrumentation etc. The human potential at CPW are supported by
              well laid facility steered to meet the challenges and complex
              requirements of global markets. As one of the growth strategies,
              we ensure to follow the international trends in product
              development that support overall growth of the company.
            </p>
            <p>
              Our excellent manufacturing facility encompasses well appointed
              shops for fabrication, machining, assembly, quality control etc.
              The shop areas have captive Power Generation Station for power
              needs. Apart from the production zones, open area in our premise
              facilitates large structural fabrication.
            </p>
          </>
        }
      />

      <Highlights />
      <InfraCapabilities />
      <InfraVideo />
    </>
  );
};

export default Infrastructure;
