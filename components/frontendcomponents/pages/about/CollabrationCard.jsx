import React from "react";
import Image from "next/image";

function CollabrationCard({ title, description, logo }) {
  return (
    <div className="w-full overflow-hidden rounded-md bg-white p-6 shadow-[0px_8px_24px_0px_#0505051A] md:p-10">
      <h3 className="text-gray max-w-[85%] text-lg leading-[24px] font-semibold md:text-xl">
        {title}
      </h3>
      <div
        className={`scroll [&_li]:before:bg-primary pointer-events-auto relative isolate z-10 mt-5 ${!logo ? "max-h-[270px]" : "max-h-[192px]"} touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain pr-10 text-justify text-sm md:text-base [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-1/2 [&_li]:before:left-0 [&_li]:before:size-1.5 [&_li]:before:-translate-y-1/2 [&_li]:before:rounded-full [&_li]:before:content-[''] [&_p]:not-last:mb-3 [&_ul]:mb-3`}
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
      {logo && (
        <figure className="mt-8">
          <Image
            src={logo}
            alt="logo"
            width={1920}
            height={1080}
            className="h-[45px] object-contain 2xl:h-[73px] 2xl:w-[178px]"
          />
        </figure>
      )}
    </div>
  );
}

export default CollabrationCard;
