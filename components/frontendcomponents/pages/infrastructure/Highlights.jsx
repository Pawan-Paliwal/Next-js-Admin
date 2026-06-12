import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";

const Highlights = () => {
  return (
    <section className="relative">
      <figure className="sticky top-[103px] z-1 max-h-[calc(100vh-103px)] w-full overflow-hidden">
        <Image
          className="size-full object-cover"
          src="/vector/field.png"
          alt="field"
          width={1920}
          height={1080}
        />
      </figure>

      <div className="relative z-2 w-full bg-white py-9 xl:py-20">
        <div className="container">
          <Heading className="text-center">Highlights</Heading>

          <div className="grid grid-cols-2 gap-5 xl:mt-16">
            {data?.map(({ icon, description }, i) => {
              return (
                <div
                  className="flex rounded-md border border-[#D9D9D9] px-8 py-7"
                  key={i}
                >
                  <figure className="flex-center mr-0 size-[133px] overflow-hidden rounded-full bg-[linear-gradient(180deg,#D4F2FF_0%,#F0FBFF_100%)]">
                    <Image
                      src={icon}
                      alt="highlight"
                      width={500}
                      height={500}
                    />
                  </figure>
                  <figcaption
                    dangerouslySetInnerHTML={{ __html: description }}
                    className="[&_span]:text-primary ml-7 flex flex-1 flex-col justify-center border-l border-[#EC2526] pl-7 *:font-medium [&_span]:font-bold"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;

const data = [
  {
    icon: "/icon/factory.svg",
    description:
      "<p>Full Fledged Workshop , spread over <span>200,000 Sq. Ft.</span> area.</p>",
  },
  {
    icon: "/icon/factory.svg",
    description:
      "<p><span>Well established Computerized Design & Drawing unit</span> with latest software facilities like AutoCAD, Solid Works, Inventor and other 3-D software .</p>",
  },
  {
    icon: "/icon/erp.svg",
    description:
      "<p>Use of ERP system (Totally Computerized Working Environment)</p>",
  },
  {
    icon: "/icon/laboratory.svg",
    description:
      "<p><span>Full Fledged Laboratory</span> for inspection & analysis of  the raw material</p>",
  },
  {
    icon: "/icon/books.svg",
    description:
      "<p><span>Full Fledged Library</span> having 5000 Technical and other books and all International Standards</p>",
  },
  {
    icon: "/icon/generator.svg",
    description:
      "<p><span>Own Captive Power Generation Station</span> of 1000 kW capacity</p>",
  },
];
