"use client";
import Image from "next/image";
import { useSelector } from "react-redux";

const OpeningModal = () => {
  const { isModal, modalData } = useSelector((state) => state.modal);

  const { vacancy, location, type, brief } = modalData || {};

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-40 w-[95%] max-w-[788px] -translate-x-1/2 -translate-y-1/2 bg-white px-16 pt-10 pb-0 transition-all duration-500 ease-in-out ${isModal === "opening" ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"}`}
    >
      <div className="border-gray/20 border-b pb-5">
        <p className="text-primary mb-1 flex items-center gap-2">
          <Image
            src="/icon/location-blue.svg"
            alt="location"
            width={24}
            height={24}
          />
          {location}
        </p>
        <h3 className="text-gray mb-1 text-xl font-bold">{vacancy}</h3>
        <p>{type}</p>
      </div>

      <div
        className="scroll space-y-3 [&_strong]:font-semibold [&_strong]:text-gray [&_ul>li]:pl-6 [&_ul>li]:relative [&_ul>li]:before:absolute [&_ul>li]:before:content-[''] [&_ul>li]:before:left-px  [&_ul>li]:before:top-[10px] [&_ul>li]:before:bg-primary [&_ul>li]:before:size-[10px] [&_h4]:font-bold [&_h4]:text-gray [&_ul]:space-y-3  max-h-[65vh] overflow-y-auto pt-5"
        dangerouslySetInnerHTML={{ __html: brief }}
      />
    </div>
  );
};

export default OpeningModal;
