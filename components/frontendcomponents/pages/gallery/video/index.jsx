"use client";
import React from "react";
import FeaturedVideo from "./FeaturedVideo";
import VideoList from "./VideoList";
import { useGetVideoGalleryDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";
const VideoGallery = () => {
  const { data, isLoading, error } = useGetVideoGalleryDataQuery();
  if (isLoading) return <Loading />;
  return (
    <>
      {data?.videoGalleryData?.length > 0 && (
        <FeaturedVideo videoGalleryData={data.videoGalleryData} />
      )}
      {data?.videoGalleryData?.length > 0 && (
        <VideoList videoGalleryData={data.videoGalleryData} />
      )}
    </>
  );
};

export default VideoGallery;