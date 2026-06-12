import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import AboutPolicy from "../../../organisms/Detail";
import QualityFramework from "./QualityFramework";
import Commitment from "./Standards";

const QualityAssurance = () => {
  return (
    <>
      <Hero
        className="[&_h1]:max-w-[700px]! [&_p]:max-w-[690px]!"
        image="/image/policies/quality.jpg"
        title="Quality Assurance Policy"
        description="A Focus on Quality at Each Step With Robust QA Practices and Tests"
        scrollTo="#framework"
      />

      <AboutPolicy
        data={
          <>
            <p>
              Quality over quantity has always been the guiding principle at
              CPG. For more than 60 years, we have been dedicated to
              manufacturing world-class products that deliver high efficiency,
              durability, and long service life. Our focus has consistently been
              on creating solutions that meet and exceed international
              standards, supported by certifications such as IMS (ISO 9001,
              45001, 14001) and CE marking for selected products.
            </p>{" "}
            <p>
              To ensure flawless performance, we adopt advanced manufacturing
              practices and stringent quality controls that minimize even the
              smallest defects. Our approach is built on a strong quality
              framework driven by the following principles:
            </p>
          </>
        }
      />
      <QualityFramework
        title="The CPG Quality Framework is Built on These Principles"
        data={data}
      />
      <Commitment />
    </>
  );
};

export default QualityAssurance;

const data = [
  {
    title: "Customer Focus & Commitment",
    shortDescription:
      "Understanding customer needs and striving to exceed expectations.",
    icon: "/icon/aim.svg",
  },
  {
    title: "Quality Responsibility",
    shortDescription:
      "Strong leadership commitment to uphold and implement quality standards.",
    icon: "/icon/quality.svg",
  },
  {
    title: "People & Resources",
    shortDescription:
      "Quality is the responsibility of every employee across the organization.",
    icon: "/icon/group.svg",
  },
  {
    title: "Continual Improvement",
    shortDescription:
      "Regular reviews and enhancements of processes and practices.",
    icon: "/icon/graph.svg",
  },
  {
    title: "Customer Satisfaction",
    shortDescription:
      "Continuous measurement and improvement of customer experience.",
    icon: "/icon/happy-face.svg",
  },
];
