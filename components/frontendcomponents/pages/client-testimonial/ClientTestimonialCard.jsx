import Image from "next/image";
import React from "react";

const ClientTestimonialCard = ({ company, review, logo }) => {
  return (
    <div className="relative h-fit overflow-hidden rounded-md bg-[#EDF7FB] p-8 shadow-[0px_3px_42.4px_-28px_#0000003D]">
      <Image
        src="/icon/quote.svg"
        alt="quote"
        width={68}
        height={68}
        className="absolute top-4 right-8"
      />
      <p
        className="max-w-[80%]"
        dangerouslySetInnerHTML={{ __html: review }}
      />
      <div className="mt-6 flex items-center gap-6">
        <figure className="max-w-[150px]">
          <Image src={logo} alt={company} width={200} height={150} />
        </figure>
        <figcaption className="max-w-[250px] text-xl font-semibold text-black">
          {company}
        </figcaption>
      </div>
    </div>
  );
};

export default ClientTestimonialCard;
