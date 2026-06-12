"use client";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";

const CloseModal = ({ className }) => {
  const { closeModal } = useModal();

  return (
    <button
      className={`absolute  top-[15px] right-[15px] md:top-5 md:right-5 cursor-pointer ${className}`}
      onClick={() => {
        closeModal();
      }}
    >
      <Image src="/icon/close.svg" alt="close" width={36} height={36} />
    </button>
  );
};

export default CloseModal;
