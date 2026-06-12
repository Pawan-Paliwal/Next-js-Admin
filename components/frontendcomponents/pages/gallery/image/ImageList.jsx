"use client";
import useFancybox from "@/hooks/useFancybox";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ImageList = ({ galleryData }) => {
  const [setRoot] = useFancybox();

  const data = galleryData?.map((item) => ({
    title: item.galleryTitle,
    images: [
      `/OnlineImages/GalleryImages/${item.galleryImage}`,
      ...item.photos?.map((p) => `/OnlineImages/GalleryImages/${p.photoImage}`),
    ],
  }));

  return (
    <section
      ref={setRoot}
      id="image-gallery"
      className="bg-background pt-14 pb-20"
    >
      <div className="container">
        <div className="grid grid-cols-3 gap-5">
          {data?.map((item, index) => (
            <ImageCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageList;

const ImageCard = ({ title, images }) => {
  return (
    <>
      <Link href={images[0]} data-fancybox={title || "gallery"}>
        <figure className="relative h-[267px] w-full overflow-hidden rounded-md before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_24.34%,rgba(102,102,102,0)_72.1%)] before:content-['']">
          <Image
            fill
            src={images[0]}
            alt={title}
            className="size-full object-cover"
          />
          <figcaption className="absolute right-0 bottom-0 left-0 z-2 px-5 pb-9 text-center text-xl font-medium text-white">
            {title}
          </figcaption>
        </figure>
      </Link>

      {images.slice(1)?.map((image, index) => (
        <Link
          key={index}
          href={image}
          data-fancybox={title || "gallery"}
          className="hidden"
        />
      ))}
    </>
  );
};