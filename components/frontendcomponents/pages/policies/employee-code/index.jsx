import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import AboutPolicy from "../../../organisms/Detail";
import QualityFramework from "../quality/QualityFramework";
import PolicyNote from "../PolicyNote";

const EmployeeCodeOfConduct = () => {
  return (
    <>
      <Hero
        image="/image/policies/employee.png"
        title="Employee Code of Conduct Policy"
        description="Encouraging a Respectful and Responsible Workplace with Conduct Standards"
        scrollTo="#framework"
      />

      <AboutPolicy
        data={
          <p>
            An Employee Code of Conduct Policy establishes the ethical
            standards, professional expectations, and compliance requirements
            that guide employee behaviour within the organization. It plays a
            crucial role in maintaining a safe, respectful, and legally
            compliant workplace while promoting integrity and accountability at
            all levels. The policy ensures that all employees understand their
            responsibilities and the consequences of any misconduct, which may
            include disciplinary action up to termination.
          </p>
        }
      />

      <QualityFramework
        title="Key Components of the Policy Include"
        data={data}
      />

      <PolicyNote content="By adhering to these principles, the organization fosters a culture of trust, respect, and professionalism, ensuring a productive and ethical work environment." />
    </>
  );
};

export default EmployeeCodeOfConduct;

const data = [
  {
    title: "Professional Behaviour & Ethics",
    shortDescription:
      "Employees are expected to act with honesty, integrity, and professionalism while aligning with the company’s core values.",
    icon: "/icon/briefcase.svg",
  },
  {
    title: "Compliance with Laws & Policies",
    shortDescription:
      "Strict adherence to all applicable laws, regulations, and internal company guidelines is mandatory.",
    icon: "/icon/hammer.svg",
  },
  {
    title: "Respectful Workplace",
    shortDescription:
      "The organization enforces a zero-tolerance approach toward discrimination, harassment, or any form of inappropriate behaviour.",
    icon: "/icon/handshake.svg",
  },
  {
    title: "Conflict of Interest",
    shortDescription:
      "Employees must avoid situations where personal interests conflict with organizational goals and disclose any potential conflicts promptly.",
    icon: "/icon/split-arrows.svg",
  },
  {
    title: "Confidentiality & Data Protection",
    shortDescription:
      "Safeguarding sensitive company, client, and employee information is essential, and unauthorized disclosure is strictly prohibited.",
    icon: "/icon/solar_shield.svg",
  },
  {
    title: "Protection of Company Assets",
    shortDescription:
      "All company resources, including equipment and digital systems, must be used responsibly and only for legitimate purposes.",
    icon: "/icon/lock.svg",
  },
  {
    title: "Social Media Usage",
    shortDescription:
      "Employees should maintain responsible online behaviour that reflects positively on the organization and protects its reputation.",
    icon: "/icon/heart-msg.svg",
  },
];
