"use client";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";

const DirerctorsCard = ({ image, name, designation, about }) => {
  const { openModal } = useModal();

  return (
    <div
      onClick={() =>
        openModal("team", { name, description: designation, about, image })
      }
      className="bg-background group border-border w-full cursor-pointer overflow-hidden rounded-md border"
    >
      <figure className="h-[260px] w-full overflow-hidden md:h-[341px]">
        <Image
          src={image}
          alt=""
          width={1920}
          height={1080}
          className="size-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </figure>
      <figcaption className="px-3 py-4 text-center md:px-5 md:py-6">
        <h3 className="text-gray md:mb-1 text-base font-semibold md:text-xl">
          {name}
        </h3>
        <p className="text-center text-sm md:text-base">{designation} </p>
      </figcaption>
    </div>
  );
};

export default DirerctorsCard;
