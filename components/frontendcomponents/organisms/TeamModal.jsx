"use client";
import { useSelector } from "react-redux";
import CloseModal from "../atoms/CloseModal";
import Image from "next/image";

const TeamModal = () => {
  const { isModal, modalData } = useSelector((state) => state.modal);

  const { name, description, image, about } = modalData || {};

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-1/2 left-1/2 z-50 w-[95%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white px-4 py-6 transition-all duration-500 ease-in-out md:max-h-[381px] md:w-[700px] md:px-8 md:py-10 lg:w-[795px] 2xl:max-h-[520px] 2xl:w-[1000px] ${
        isModal === "team"
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-0 opacity-0"
      } `}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[333px_1fr] lg:gap-14">
        <figure className="col-span-1 h-[250px] w-full overflow-hidden rounded-sm md:h-[305px]">
          <Image
            className="h-full w-full object-cover"
            src={image || "/image/team/aditya.svg"}
            alt={name || ""}
            width={333}
            height={305}
          />
        </figure>

        <div className="">
          <div className="mb-4 border-b border-[#D2D2D2] pb-4">
            <h3 className="text-lg leading-[38px] font-bold text-black md:text-xl">
              {name}
            </h3>
            <p className="text-alpha text-sm leading-[1.2]">{description}</p>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: about }}
            className="scroll text-text mb-4 max-h-[196px] overflow-y-auto text-justify text-sm leading-[24px] wrap-break-word 2xl:max-h-[296px] [&_p]:not-first:mt-2"
          ></div>
        </div>
      </div>

      <CloseModal />
    </div>
  );
};

export default TeamModal;
