"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Autoplay, FreeMode } from "swiper/modules";

const Countries = () => {
  return (
    <>
      <section className="relative py-9 md:py-12 lg:py-16 xl:py-20">
        <div className="absolute top-1/2 left-0 hidden h-[320px] -translate-y-1/2 xl:block 2xl:w-[25%]">
          <Slider
            className="[&_.swiper-slide-active>p]:text-primary [&_.swiper-slide-active>p]:before:bg-primary [&_.swiper-slide]:h-fit! [&_.swiper-slide-active>p]:pl-[84px] [&_.swiper-slide-active>p]:text-2xl [&_.swiper-slide-active>p]:before:w-[74px] [&_.swiper-slide-active>p]:lg:text-xl 2xl:[&_.swiper-slide-active>p]:pl-[50%] 2xl:[&_.swiper-slide-active>p]:before:w-[60%] [&_.swiper-wrapper]:ease-linear"
            card="country"
            loop={false}
            data={data}
            isBtnVisible={false}
            slidesPerView="auto"
            direction="vertical"
            centeredSlides={true}
            speed={2000}
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
          />
        </div>

        <div className="grid grid-cols-1 items-center justify-end gap-6 px-[15px] md:gap-12 lg:grid-cols-2 lg:gap-20 lg:px-6 xl:grid-cols-[35%_45%] xl:gap-10 2xl:grid-cols-[33%_45%] 2xl:px-20">
          <div className="flex justify-center lg:justify-end">
            <video
              className="md:size-[400px] lg:size-auto"
              src="/video/globe.mp4"
              autoPlay
              loop
              muted
            ></video>
          </div>
          <div>
            <span className="text-primary text-sm font-medium uppercase">
              Serving 50+ Countries
            </span>
            <Heading className="my-4">
              Manufacturing Solutions Worldwide
            </Heading>
            <p className="mb-4 text-justify text-sm wrap-break-word [word-spacing:-0.1rem] md:text-base">
              With over 60 years of heavy engineering excellence and a dedicated
              team of 1500+ highly skilled professionals, we have established
              ourselves as a trusted multinational heavy and precision
              engineering company. Our commitment to quality, safety, and
              innovation is reflected in our prestigious certifications,
              including
            </p>
            <ul className="[&>li]:before:bg-primary [&>li]:relative [&>li]:pl-5 [&>li]:not-last:mb-1 [&>li]:before:absolute [&>li]:before:top-[8px] [&>li]:before:left-0 [&>li]:before:size-1.75">
              <li>AS 9100 Rev D</li>
              <li>ISO 45001:2018</li>
              <li>ISO 9001:2015</li>
              <li>ISO 14001:2015</li>
              <li>ASME (U & R Stamps).</li>
            </ul>
            <p className="mt-4">
              We are also approved by leading regulatory bodies such as EIL,
              IBR, and PESO, reinforcing our capability to deliver world-class
              turnkey solutions across diverse industries.
            </p>
            <Button href="/our-presence" className="mt-8 inline-block">
              View all Countries
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Countries;

const data = [
  "Tanzania",
  "Myanmar",
  "United Kingdom",
  "South Africa",
  "Czech Republic",
  "Australia",
  "Russia",
  "Columbia",
];
