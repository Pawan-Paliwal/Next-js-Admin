import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import Commitment from "./Commitment";
import PolicyList from "./PolicyList";
import Article from "../../organisms/Detail";
import AboutPolicy from "../../organisms/Detail";

const Policies = () => {
  return (
    <>
      <Hero
        image="/image/policies/banner.jpg"
        title="Policies Overview"
        description="Transparent policies that reflect our values of integrity, responsibility and customer satisfaction."
        scrollTo="#policies"
      />

      <AboutPolicy
        data={
          <>
            <p>
              Our organization is committed to providing a safe and healthy
              working environment for every individual involved in our
              operations and product delivery processes. We continuously strive
              to enhance workplace safety standards and ensure the well-being of
              all employees through effective planning and management systems.
            </p>
            <p>
              These principles guide our daily operations and decision-making
              processes, helping us create a proactive safety culture. By
              prioritizing employee well-being and adhering to regulatory
              requirements, we aim to build a secure, responsible, and
              sustainable work environment for everyone.
            </p>
          </>
        }
      />
      <Commitment
        title="Our Commitments include:"
        data={[
          "Preventing workplace injuries and ill health.",
          "Continual improvement of the Occupational Health & Safety (OH&S) management system.",
          "Minimizing occupational hazards and reducing OH&S risks.",
          "Continual improvement of quality systems in all operations.",
          "Satisfy all applicable requirements.",
        ]}
        image="/image/policies/commitments.svg"
      />
      <PolicyList />
    </>
  );
};

export default Policies;
