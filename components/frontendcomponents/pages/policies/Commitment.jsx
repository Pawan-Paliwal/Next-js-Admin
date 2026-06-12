import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";

const Commitment = ({ title, data, image }) => {
  return (
    <section className="bg-background py-16" id="commitment">
      <div className="container">
        <Heading className="text-center">{title}</Heading>

        <div className="mx-auto mt-16 grid max-w-[836px] grid-cols-2 gap-10">
          <figure className="h-[292px] sticky top-[calc(var(--header-height)_+_24px)] overflow-hidden rounded-md">
            <Image
              className="size-full object-cover"
              src={image}
              alt="commitments"
              width={1920}
              height={1080}
            />
          </figure>

          <ul className="border-l border-primary">
            {data?.map((item, i) => {
              return (
                <li key={i} className="pl-6 not-last:mb-3 first:mt-3 relative before:content-[''] before:absolute before:-left-[8px] before:top-1/2 before:size-[14px] before:-translate-y-1/2 before:rounded-full before:bg-primary">
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Commitment;


