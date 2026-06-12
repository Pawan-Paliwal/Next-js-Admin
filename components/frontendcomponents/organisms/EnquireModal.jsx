"use client";
import CloseModal from "../atoms/CloseModal";
import Image from "next/image";
import Button from "../atoms/Button";
import EnquiryField from "../molecules/EnquiryField";
import { useSelector } from "react-redux";

const EnquireModal = () => {
  const { isModal } = useSelector((state) => state.modal);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-9 w-full bg-white p-10 py-16 transition-all duration-500 ease-in-out lg:max-w-[420px] ${isModal === "enquire" ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col items-center">
        <h3 className="font-red-hat-display mb-2 text-center text-3xl font-semibold">
          Enquire Now
        </h3>
        <p className="text-lambda/80 max-w-[85%] text-center leading-[20px]">
          Get expert guidance for your successful business journey.
        </p>
        <form className="mt-10 flex w-full flex-col items-center gap-6">
          <EnquiryField />
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </div>
      <Image
        className="absolute right-0 bottom-0"
        src="/vector/icon.svg"
        alt="icon"
        width={246}
        height={272}
      />
      <CloseModal />
    </div>
  );
};

export default EnquireModal;
