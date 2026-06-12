"use client";
import Image from "next/image";
import Button from "../atoms/Button";

const Hero = ({
  title,
  navigation,
  image,
  video,
  scrollTo,
  description,
  className,
  variant = "default",
}) => {
  const { path, label } = navigation || {};

  return (
    <section
      className={`relative ${className} h-[400px] before:absolute before:z-1 before:inset-0 before:bg-[linear-gradient(0deg,rgba(0,0,0,0.7)_9.03%,rgba(102,102,102,0)_62.22%)] md:h-[60vh] lg:h-[70vh]`}
    >
      {video && (
        <video
          src={video}
          autoPlay
          muted
          loop
          className="size-full object-cover object-center"
        />
      )}

      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="size-full object-cover object-center"
        />
      )}

      <div className="flex-center z-2 absolute bottom-[34px] left-1/2 w-[95%] -translate-x-1/2 flex-col md:bottom-[120px] md:w-full">
        <h1
          className={`font-red-hat-display text-center font-bold text-white ${variant === "secondary" ? " text-[24px] leading-[1.2] md:max-w-[450px] md:text-3xl lg:max-w-[520px] lg:text-[42px] xl:max-w-[700px] xl:text-5xl 2xl:text-5xl" : "max-w-[529px] text-[28px] leading-[1.2] md:text-[42px] lg:text-[48px] xl:max-w-[668px] xl:text-6xl 2xl:max-w-[600px]"}`}
        >
          {title}
        </h1>
        <p
          className={`mt-2 text-center text-sm leading-normal text-white md:mt-4 md:text-base 2xl:max-w-[500px] 2xl:text-lg ${variant === "secondary" ? "max-w-[468px]" : " max-w-[320px] md:max-w-[401px]"}`}
        >
          {description}
        </p>
        {navigation && (
          <Button
            className="mx-auto mt-0 flex items-center justify-center gap-4 font-medium transition-all duration-500 ease-in-out lg:mt-3 xl:mt-6"
            href={path}
          >
            {label}
          </Button>
        )}
      </div>

      <figure className="absolute right-6 bottom-6 z-3   hidden animate-bounce md:block lg:right-14 lg:bottom-14">
        <a href={scrollTo}>
          <Image
            className="md:size-[36px] lg:size-[49px]"
            src="/icon/mouse.svg"
            alt="mouse"
            width={49}
            height={49}
          />
        </a>
      </figure>
    </section>
  );
};

export default Hero;
