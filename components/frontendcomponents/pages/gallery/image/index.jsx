"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import ImageList from "./ImageList";
import { useGetGalleryDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";

const ImageGallery = () => {
  const { data, isLoading, error } = useGetGalleryDataQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        image="/image/gallery/banner.png"
        title="Photo Gallery"
        description="An aesthetic showcase of our engineering heritage projects, quality and global impact."
        scrollTo="#image-gallery"
      />
      {data?.galleryData?.length > 0 && (
        <ImageList galleryData={data.galleryData} />
      )}
    </>
  );
};

export default ImageGallery;