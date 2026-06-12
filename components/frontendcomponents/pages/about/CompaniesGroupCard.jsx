import Button from "@/components/frontendcomponents/atoms/Button";
import Image from "next/image";
import React from "react";

const CompaniesGroupCard = ({ title, description, image, link }) => {
  return (
    <div className="group grid w-full grid-cols-1 md:grid-cols-2 overflow-hidden rounded-md">
      <figure className=" md:h-full overflow-hidden">
        <Image
          className="size-full max-h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
          alt={title}
          width={1920}
          height={1080}
        />
      </figure>
      <div className="flex flex-col items-start bg-white/20 p-4 md:px-10 md:py-12">
        <h2 className="font-red-hat-display mb-5 text-xl md:text-[28px] md:leading-[32px] font-bold text-white">
          {title}
        </h2>
        <p className="mb-7 line-clamp-5 md:text-base text-sm text-white 2xl:mb-12">{description}</p>
        <Button className="xl:mb-4" href={link ? link : "#"} variant="white">
          Know More
        </Button>
      </div>
    </div>
  );
};

export default CompaniesGroupCard;
