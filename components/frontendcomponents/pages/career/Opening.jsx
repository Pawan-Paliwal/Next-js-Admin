"use client";
import Button from "@/components/frontendcomponents/atoms/Button";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";

const Opening = ({ careerData }) => {
  const { openModal } = useModal();

  const data = careerData?.map((item) => ({
    vacancy: item.CareerName,
    location: item.Location,
    type: item.CareerType,
    brief: item.CareerDescription,
    date: item.PostedDate,
  }));

  return (
    <section className="bg-primary relative py-20">
      <Image
        className="absolute -bottom-[50px] -left-[35px]"
        alt="icon"
        src="/vector/icon.svg"
        width={307}
        height={307}
      />
      <div className="container grid grid-cols-[1fr_681px] gap-10">
        <div>
          <h2 className="text-4xl leading-[1.2] font-bold text-white">
            Current Openings
          </h2>
        </div>
        <div>
          {data?.map((item, i) => {
            const { vacancy, location, type } = item;
            return (
              <div
                className="flex items-center justify-between border-white/20 pb-8 not-first:pt-8 not-last:border-b"
                key={i}
              >
                <div className="pr-8">
                  <p className="mb-1.5 flex items-center gap-2 text-white">
                    <Image
                      src="/icon/location-wide.svg"
                      width={16}
                      height={18}
                      alt="location"
                    />
                    {location}
                  </p>
                  <h3 className="mb-1.5 text-xl font-semibold text-white">
                    {vacancy}
                  </h3>
                  <p className="text-white">{type}</p>
                </div>
                <Button
                  onClick={() => openModal("opening", { ...item })}
                  className="rounded-full text-sm!"
                  variant="white"
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Opening;