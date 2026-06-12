import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";

const PolicyList = () => {
  return (
    <section
      id="policies"
      className="bg-primary relative overflow-hidden py-20"
    >
      {data?.length % 2 !== 0 ? (
        <Image
          src="/vector/icon.svg"
          alt="icon"
          width={329}
          height={329}
          className="absolute -right-20 -bottom-5"
        />
      ) : (
        ""
      )}
      <div className="container">
        <Heading className="text-center text-white">Our Policies</Heading>

        <div className="mt-16 grid grid-cols-2 gap-5">
          {data?.map(({ title, icon, shortDescription, href }, i) => (
            <div
              key={i}
              className="flex flex-col gap-6 overflow-hidden rounded-md bg-white p-7"
            >
              <div className="flex items-center gap-5">
                <figure className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#D4F2FF_0%,#F0FBFF_100%)]">
                  <Image src={icon} alt={title} width={35} height={35} />
                </figure>
                <h3 className="text-gray before:content relative max-w-[252px] text-xl leading-[1.3] font-semibold before:absolute before:-bottom-3 before:left-0 before:h-[3px] before:w-[59px] before:bg-[#D40C14]">
                  {title}
                </h3>
              </div>
              <div
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
              <Button href={href} className="w-fit" variant="outlinePrimary">
                View More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicyList;

const data = [
  {
    title: "Quality Assurance Policy",
    shortDescription:
      "<p >Quality over quantity has always been the guiding principle at CPG. For more than 60 years, we have been dedicated to manufacturing world-class products that deliver high efficiency, durability, and long service life.</p>",
    icon: "/icon/badge.svg",
    href: "/our-policies/quality-assurance-policy",
  },
  {
    title: "Environmental, Health, and Safety (EHS)",
    shortDescription:
      "<p >Our organization is committed to providing a safe, healthy, and environmentally responsible working environment for every individual involved in our operations and product delivery processes.</p>",
    icon: "/icon/streamline-plump_medical.svg",
    href: "/our-policies/environmental-health-safety",
  },
  {
    title: "HR Policy",
    shortDescription:
      "<p>We are committed to delivering products that meet high standards of quality and performance, supported by precision, continuous monitoring, and ongoing improvement to ensure reliability at every stage of production.</p>",
    icon: "/icon/solar_clipboard.svg",
    href: "/our-policies/hr",
  },
  {
    title: "Employee Code of Conduct Policy",
    shortDescription:
      "<p>An Employee Code of Conduct Policy establishes the ethical standards, professional expectations, and compliance requirements that guide employee behaviour within the organization.</p>",
    icon: "/icon/clarity_employee.svg",
    href: "/our-policies/employee-code-of-conduct",
  },
  {
    title: "Data Security and Privacy Policy",
    shortDescription:
      "<p>At Chanderpur Group , we are committed to protecting personal and organizational data while ensuring transparency and compliance with data protection regulations.</p>",
    icon: "/icon/solar_shield.svg",
    href: "/our-policies/data-security",
  },

];
