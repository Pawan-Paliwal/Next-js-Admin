"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import { Navigation } from "swiper/modules";

const MileStoneCard = ({ year, message, image, name }) => {
  const { openModal } = useModal();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-20">
      <figure className="w-full rounded-md overflow-hidden">
        <Image
          className="size-full object-cover"
          src={image}
          alt="founder"
          width={1920}
          height={1080}
        />
      </figure>
      <div className="flex flex-col justify-center">
        <h5 className="text-gray mb-2 text-lg md:text-xl 2xl:text-2xl font-semibold">{name}</h5>
        <p className=" md:mb-8 md:text-base text-sm">{message}</p>
      </div>
    </div>
  );
};

export default MileStoneCard;
