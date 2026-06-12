import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";

const QualityFramework = ({ title, data }) => {
  return (
    <section className="bg-background py-16" id="framework">
      <div className="container">
        <Heading className="mx-auto max-w-[750px] text-center">
          {title}
        </Heading>

        <div className="mt-16 grid grid-cols-3 gap-4">
          {data?.map(({ title, shortDescription, icon }, i) => (
            <div className="overflow-hidden rounded-md bg-white p-6" key={i}>
              <figure className="flex-center size-[72px] overflow-hidden rounded-full bg-[linear-gradient(180deg,#D4F2FF_0%,#F0FBFF_100%)]">
                <Image src={icon} alt={title} width={35} height={35} />
              </figure>
              <h3 className="text-gray before:content relative mt-4 mb-6 text-xl font-semibold before:absolute before:-bottom-3 before:left-0 before:h-[3px] before:w-[59px] before:bg-[#D40C14]">
                {title}
              </h3>
              <p>{shortDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityFramework;

