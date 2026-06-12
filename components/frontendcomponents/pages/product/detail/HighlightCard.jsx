import Image from "next/image";
import React from "react";

const HighlightCard = ({ index, item }) => {
  return (
    <div id="" className="relative w-full overflow-hidden rounded-md bg-[#3FA5D4] p-6">
      <span className="mb-6 flex size-12.25 items-center justify-center rounded-xl bg-white text-center text-2xl font-extrabold text-[#0F8FC9]">
        {index + 1}
      </span>
      <p className="mb-5 text-lg text-white">{item}</p>
      <Image
        src="/vector/icon.svg"
        alt="vector"
        width={125}
        height={127}
        className="absolute -right-8 -bottom-8"
      />
    </div>
  );
};

export default HighlightCard;
