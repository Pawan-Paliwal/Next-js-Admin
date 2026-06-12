import React from "react";
import AboutPolicy from "../../../organisms/Detail";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import QualityFramework from "../quality/QualityFramework";
import PolicyNote from "../PolicyNote";

const HRPolicy = () => {
  return (
    <>
      <Hero
        image="/image/policies/hr.jpg"
        title="HR Policy"
        description="Developing an environment where people and performance can grow"
        scrollTo="#framework"
      />

      <AboutPolicy
        data={
          <>
            {" "}
            <p>
              At our organization, we are committed to creating a fair,
              inclusive, and respectful workplace where every employee is
              treated with dignity and equality. We promote equal opportunities
              across all aspects of employment and ensure a safe, secure, and
              harassment-free environment. Our policies are designed to support
              employee well-being, encourage ethical practices, and maintain
              compliance with all applicable laws and regulations.
            </p>{" "}
          </>
        }
      />

      <QualityFramework
        title="Key principles of our HR Policy include:"
        data={data}
      />

      <PolicyNote content="This policy applies to all employees across all units, branches, and offices of the organization, helping us build a culture of trust, respect, and accountability." />
    </>
  );
};

export default HRPolicy;

const data = [
  {
    title: "Equal Opportunity:",
    shortDescription:
      "No discrimination based on race, religion, gender, age, nationality, social status, or any other protected category.",
    icon: "/icon/balance_school.svg",
  },
  {
    title: "Fair Employment Practices:",
    shortDescription:
      "Equal treatment in recruitment, hiring, compensation, promotion, training, and work assignments.",
    icon: "/icon/handshake_red.svg",
  },
  {
    title: "Compliance with Laws:",
    shortDescription:
      "Adherence to all applicable labour laws and regulations, with exceptions only where legally required.",
    icon: "/icon/solar_shield.svg",
  },
  {
    title: "Zero Tolerance for Harassment:",
    shortDescription:
      "Strict action against bullying, intimidation, or any form of workplace misconduct.",
    icon: "/icon/punch_ban.svg",
  },
  {
    title: "POSH Policy (Prevention of Sexual Harassment)",
    shortDescription:
      "A structured system to prevent and address sexual harassment, ensuring employee safety and dignity through proper complaint and redressal mechanisms.",
    icon: "/icon/ban.svg",
  },
  {
    title: "Grievance Handling",
    shortDescription:
      "All employee concerns are addressed through a fair, confidential, and timely process.",
    icon: "/icon/employee_line.svg",
  },
];
