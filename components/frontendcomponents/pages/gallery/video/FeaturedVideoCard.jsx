"use client";
import PlayBtn from "@/components/frontendcomponents/atoms/PlayBtn";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";

const FeaturedVideoCard = ({ image, video, title }) => {
  const { openModal } = useModal();

  return (
    <figure className="relative h-[418px] w-[570px] before:z-1  before:absolute before:inset-0 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.8)_25.42%,rgba(0,0,0,0)_65.08%)]">
      <Image
        className="size-full object-cover"
        src={image}
        alt={title}
        fill
      />
      <figcaption className="absolute z-2 right-0 bottom-0 left-0 flex items-center gap-6 p-8">
        <PlayBtn
          className="shrink-0"
          onClick={() => openModal("video", video)}
          variant="secondary"
        />{" "}
        <p className="text-xl font-semibold text-white">{title}</p>
      </figcaption>
    </figure>
  );
};

export default FeaturedVideoCard;
