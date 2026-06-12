"use client";
import { useSelector } from "react-redux";
import CloseModal from "../atoms/CloseModal";
import { useEffect, useState } from "react";

const VideoModal = () => {
  const { isModal, modalData } = useSelector((state) => state.modal);
  const [videoSrc, setVideoSrc] = useState(
    "https://www.youtube.com/embed/N9Xq-LlzN_0?autoplay=1&mute=1",
  );

  const getAutoplayUrl = (url) => {
    if (typeof url !== "string")
      return "https://www.youtube.com/embed/N9Xq-LlzN_0?autoplay=1&mute=1";
    let finalUrl = url;

    if (finalUrl.includes("youtube.com/embed/")) {
      finalUrl += finalUrl.includes("?")
        ? finalUrl.includes("autoplay=1")
          ? ""
          : "&autoplay=1"
        : "?autoplay=1";
    }

    return finalUrl;
  };

  useEffect(() => {
    if (isModal === "video") {
      setVideoSrc(getAutoplayUrl(modalData));
    } else {
      setVideoSrc(null);
    }
  }, [isModal, modalData]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-40 aspect-video w-[95%] max-w-[700px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out lg:max-w-[1000px] ${isModal === "video" ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"}`}
    >
      <iframe
        className="h-full w-full border-2 border-white object-cover"
        src={videoSrc}
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
      <CloseModal className=" -top-12! md:-top-16! p-1  right-0 flex size-[35px] items-center justify-center rounded-full bg-white text-white transition-all duration-500 ease-in-out hover:scale-90 md:-right-14! md:size-[47px]" />
    </div>
  );
};

export default VideoModal;
