import Image from "next/image";
import React from "react";

const MissionCard = ({ img, title, description }) => {
  return (
    <div className="flex-center h-[343px] w-full flex-col gap-4 rounded-md bg-white p-10 text-center transition-all duration-500 ease-in-out">
      <Image
        className="size-[48px] transition-all duration-500 ease-in-out 2xl:size-[70.55px]"
        src={img}
        alt="mission"
        width={48}
        height={48}
      />
      <p className="text-sm opacity-0 transition-all duration-500 ease-in-out [word-spacing:-.09rem] md:text-base">
        {description}
      </p>
    </div>
  );
};

export default MissionCard;
