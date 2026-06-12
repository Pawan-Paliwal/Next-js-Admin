"use client";
import CloseModal from "@/components/frontendcomponents/atoms/CloseModal";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { SOCIAL_LINKS } from "@/constants/social";
import { SIDE_MENU_NAVIGATION } from "@/constants/navigation";

const MenuModal = () => {
  const { isModal } = useSelector((state) => state.modal);
  const { closeModal, openModal } = useModal();

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-40 w-full bg-white transition-all duration-500 ease-in-out md:max-w-[420px] ${isModal === "menu" ? "translate-x-0" : "translate-x-full"}`}
    >
      <Image
        className="absolute right-0 bottom-0 opacity-40 invert-100"
        src="/vector/icon.svg"
        alt="logo"
        width={220}
        height={220}
      />
      <div className="from-primary/20 flex h-full flex-col bg-linear-to-t to-white px-[15px] pt-4 pb-10 md:px-10">
        <figure className="mb-8 md:mb-10">
          <Image
            className="w-[120px] md:w-[164px]"
            src="/logo.svg"
            alt="logo"
            width={164}
            height={67}
          />
        </figure>
        <ul className="overflow-y-auto *:mb-3">
          {SIDE_MENU_NAVIGATION?.map(({ label, path, children }, idx) => {
            const classes =
              "hover:text-primary font-medium inline-flex transform text-[18px] text-black transition-all duration-300 ease-in-out hover:translate-x-2";
            return label === "Corporate Video" ? (
              <li
                className={`${classes} cursor-pointer`}
                onClick={() => {
                  closeModal();
                  openModal("video");
                }}
                key={idx}
              >
                {label}
              </li>
            ) : (
              <li className="flex justify-between items-center" key={idx}>
                <Link onClick={closeModal} className={classes} href={path}>
                  {label}
                </Link>
                {
                  children?.length > 0 && (
                    <>

                    </>
                  )
                }
              </li>
            );
          })}
        </ul>
        <ul className="border-border mt-3 flex gap-5 border-t pt-4">
          {SOCIAL_LINKS?.slice(0, 4)?.map(({ label, path, icon }) => {
            return (
              <li
                key={label}
                className="transition-all duration-500 ease-in-out hover:scale-110"
              >
                <Link href={path}>
                  <Image src={icon} alt={label} width={22} height={22} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <CloseModal />
    </div>
  );
};

export default MenuModal;
