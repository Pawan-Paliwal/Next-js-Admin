"use client";
import PlayBtn from "@/components/frontendcomponents/atoms/PlayBtn";
import Image from "next/image";
import React from "react";
import { useModal } from "@/hooks/useModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const VideoList = ({ videoGalleryData }) => {
  const data = videoGalleryData?.map((item) => ({
    title: item.galleryTitle,
    image: `/OnlineImages/GalleryImages/${item.galleryImage}`,
    video: item.galleryVideoURL,
  }));

  return (
    <section id="image-gallery" className="bg-background pt-14 pb-20">
      <div className="container">
        <div className="grid grid-cols-3 gap-5">
          {data?.map((item, index) => (
            <VideoCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoList;

const VideoCard = ({ title, image, video }) => {
  const { openModal } = useModal("");

  return (
    <figure className="relative h-[267px] w-full overflow-hidden rounded-md before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_24.34%,rgba(102,102,102,0)_72.1%)] before:content-['']">
      <Image
        fill
        src={image}
        alt={title}
        className="size-full object-cover"
      />
      <figcaption className="absolute right-0 bottom-0 left-0 z-2 px-5 pb-5 text-center text-base leading-[1.2] font-medium text-white">
        {title}
      </figcaption>
      <PlayBtn
        onClick={() => openModal("video")}
        variant="secondary"
        className="absolute! top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      />
    </figure>
  );
};