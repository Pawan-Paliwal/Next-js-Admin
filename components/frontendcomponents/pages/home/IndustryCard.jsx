import Image from "next/image";
import Link from "next/link";
import React from "react";

const IndustryCard = ({ image, title, video }) => {
  return (
    <Link href="" className="w-full opacity-50">
      <figure className="relative block h-[250px] w-full overflow-hidden rounded-md transition-all duration-500 ease-in-out before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0)_85.58%)] md:h-[350px]">
        <Image className="size-full object-cover" src={image} alt="" fill />

        <figcaption className="absolute right-0 bottom-0 left-0 z-2 p-4 pb-6 text-center text-lg leading-[1.2] font-bold text-white md:text-[24px]">
          {title}
        </figcaption>
      </figure>
    </Link>
  );
};

export default IndustryCard;
