import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import AboutPolicy from "../../../organisms/Detail";
import Commitment from "../Commitment";

const EnvironmentalHealthSafety = () => {
  return (
    <>
      <Hero
        image="/image/policies/hse.jpg"
        title="Environmental, Health, and Safety (EHS)"
        description="Engaging in Safe Workplaces with a Commitment to Health and Safety"
        scrollTo="#commitment"
      />
      <AboutPolicy
        data={
          <>
            {" "}
            <p>
              Our organization is committed to providing a safe, healthy, and
              environmentally responsible working environment for every
              individual involved in our operations and product delivery
              processes. We continually strive to enhance workplace safety and
              environmental standards by adopting best practices, advanced
              systems, and proactive risk management. Our systems are aligned
              with internationally recognized standards, including ISO 45001 for
              Occupational Health & Safety and ISO 14001 for Environmental
              Management, ensuring a structured and compliant approach to safety
              and sustainability. Our goal is to create a culture in which
              safety and environmental responsibility are shared priorities and
              integral to everyday operations.{" "}
            </p>{" "}
            <p>
              These principles guide our operations and decision-making
              processes, helping us maintain a proactive and responsible
              approach to workplace safety and environmental protection. By
              prioritizing employee well-being and minimizing environmental
              impact, we aim to create a secure, compliant, and sustainable work
              environment that supports long-term organizational growth and
              employee confidence.
            </p>{" "}
          </>
        }
      />

      <Commitment
        title="Our Commitments include:"
        data={[
          "Preventing workplace injuries and ill health through proactive measures.",
          "Continual improvement of the Occupational Health & Safety (OH&S) management system in line with ISO 45001.",
          "Implementing environmentally responsible practices aligned with ISO 14001 standards.",
          "Identifying, assessing, and minimizing occupational hazards and environmental risks.",
          "Promoting and maintaining an incident-free and environmentally conscious workplace culture.",
          "Ensuring strict compliance with all applicable safety, health, and environmental laws and regulations",
          "Providing regular safety, health, and environmental awareness training for employees",
          "Encouraging employee participation in safety practices and environmental initiatives",
          "Implementing emergency preparedness and response procedures",
          "Conducting periodic safety and environmental audits and performance evaluations",
          "Ensuring availability and proper use of personal protective equipment (PPE)",
        ]}
        image="/image/policies/civil-engineer.png"
      />
    </>
  );
};

export default EnvironmentalHealthSafety;
