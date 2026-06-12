import Image from "next/image";

const SlideBtn = ({ variant = "", className, img, isMobile = false }) => {
  return (
    <button
      className={`${isMobile ? "flex!" : "hidden! lg:flex!"} ${className} ${className?.includes("prev") ? `-left-5! rotate-180` : `-right-5!`} z-1! size-[42px] shrink-0 cursor-pointer ${variant === "secondary" ? "shadow-none " : variant === "tertiary" ? "shadow-none bg-none border border-text hover:bg-primary hover:border-primary " : "shadow-[0px_1.91px_7.64px_0px_#63636333] bg-white hover:bg-primary hover:border-primary"} items-center group  justify-center rounded-full transition-all duration-500`}
    >
      <Image
        className={`transition-all duration-500 ${variant === "secondary"  ? "" : "group-hover:brightness-0 group-hover:invert-100"}`}
        src={variant === "secondary" ? "/icon/right-blue-large.svg" : "/icon/right-gray.svg"}
        alt="navigation"
        width={variant === "secondary" ? 24 : 10}
        height={variant === "secondary" ? 40 : 10}
      />
    </button>
  );
};

export default SlideBtn;
