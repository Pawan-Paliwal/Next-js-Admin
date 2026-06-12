import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";

const Installation = ({ installation }) => {
  return (
    <section className="bg-background py-16">
      <div className="container grid grid-cols-2 gap-20">
        <div className="[&_ul]:grid [&_ul]:grid-cols-2 [&_ul]:gap-4  [&_ul>li]:relative [&_ul>li]:pl-8 [&_ul>li]:before:absolute [&_ul>li]:before:top-0 [&_ul>li]:before:left-0 [&_ul>li]:before:bg-[url('/icon/check_blue.svg')] [&_ul>li]:before:content-[''] [&_ul>li]:before:size-5">
          <Heading className="mb-10">{installation?.Section3Title}</Heading>
          <div
            dangerouslySetInnerHTML={{ __html: installation?.Section3Description }}
          />
        </div>
        <figure className="overflow-hidden rounded-md">
          <Image
            className="size-full object-cover"
            src={`/OnlineImages/ProductImages/${installation?.Section3MediaUrl}`}
            alt={installation?.Section3Title || "installation"}
            width={1920}
            height={1080}
          />
        </figure>
      </div>
    </section>
  );
};

export default Installation;

