import Image from "next/image";

const PlayBtn = ({ size, className, onClick, variant = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative ${variant === "secondary" ? "border border-white bg-transparent" : "bg-white"} flex-center z-2 cursor-pointer rounded-full before:absolute before:top-1/2 before:left-1/2 before:-z-1 before:h-[70%] before:w-[70%] before:-translate-x-1/2 before:-translate-y-1/2 before:animate-ping before:rounded-full before:bg-white ${size ? `size-[${size}]` : "size-[57px]"} ${className}`}
    >
      <Image
        className="size-[25px] shrink-0"
        src={`/icon/${variant === "secondary" ? "play-white.svg" : "play-blue.svg"}`}
        alt="play"
        width={25}
        height={25}
      />
    </button>
  );
};

export default PlayBtn;
