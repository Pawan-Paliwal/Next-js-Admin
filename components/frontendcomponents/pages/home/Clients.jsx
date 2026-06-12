"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import { Autoplay } from "swiper/modules";

const Clients = ({ clientData }) => {
  const { openModal } = useModal();
  const data =
    clientData?.map((item) => ({
      image: `/OnlineImages/PartnerLogos/${item.PartnerLogoImage}`,
      id: item.PartnerLogoID,
    })) || [];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(90deg,#0F8FC9_0%,#0B6B97_100%)] py-9 md:py-20 lg:py-28 xl:py-32">
      <Image
        className="absolute top-[70%] -left-[180px] h-[263px] -translate-y-1/2 md:top-1/2 md:h-[463px]"
        src="/vector/icon.svg"
        alt="icon"
        width={459}
        height={463}
      />
      <div className="container grid grid-cols-1 gap-10 md:gap-16 lg:grid-cols-[431px_1fr]">
        <div className="order-2 lg:order-1">
          <Heading className="text-white">Our Clients</Heading>
          <p className="my-6 text-justify text-sm text-white [word-spacing:-0.1rem] md:text-base">
            We are proud to partner with leading companies across industries and
            global markets. Our commitment to quality, innovation, and
            reliability has earned the trust of clients who rely on us for
            world-class manufacturing and engineering solutions.
          </p>
          <Button href="/our-clients" variant="outline">
            View all Clients
          </Button>
        </div>
        <div className="order-1 flex min-w-0 flex-col gap-8 lg:order-2">
          <Slider
            className="mr-0! overflow-visible! md:overflow-hidden! lg:mr-18! [&_.swiper-wrapper]:ease-linear!"
            card="client"
            loop={true}
            data={data?.slice(0, 4)}
            isBtnVisible={false}
            modules={[Autoplay]}
            speed={2500}
            breakpoints={{
              0: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
          />
          <Slider
            className="ml-0! overflow-visible! md:overflow-hidden! lg:ml-18! [&_.swiper-wrapper]:ease-linear!"
            card="client"
            loop={true}
            data={data?.slice(4)}
            isBtnVisible={false}
            speed={2500}
            modules={[Autoplay]}
            breakpoints={{
              0: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Clients;
