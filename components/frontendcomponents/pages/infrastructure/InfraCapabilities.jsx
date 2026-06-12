"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import useFancybox from "@/hooks/useFancybox";
import Image from "next/image";
import Link from "next/link";

const InfraCapabilities = () => {
  const [setRoot] = useFancybox();

  return (
    <section className="bg-background z-2 pt-20 pb-24">
      <div className="container">
        <Heading className="mx-auto max-w-[605px] text-center">
          In House Infrastructure Capabilities
        </Heading>

        <div ref={setRoot} className="mt-20 grid h-[438px] grid-cols-2 gap-5">
          <div className="size-full">
            <Link href={data[0]} data-fancybox="infra-gallery">
              <figure className="overlow-hidden size-full rounded-md">
                <Image
                  className="size-full object-cover"
                  src={data[0]}
                  alt="Machinery"
                  width={1920}
                  height={1080}
                />
              </figure>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {data.slice(1, 5).map((item, index) => (
              <Link key={index} href={item} data-fancybox="infra-gallery">
                <figure className="relative h-[224px] overflow-hidden rounded-md">
                  <Image
                    className="size-full object-cover"
                    src={item}
                    alt="Machinery"
                    width={1920}
                    height={1080}
                  />
                  {index === 3 && data.length > 5 && (
                    <figcaption className="flex-center absolute inset-0 flex-col bg-[#00000080]">
                      <span className="text-5xl font-medium text-white">
                        {data.length - 5}+
                      </span>
                      <span className="tracking-wider text-white uppercase">
                        Images
                      </span>
                    </figcaption>
                  )}
                </figure>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfraCapabilities;

const data = [
  "/image/gallery/arial-view.png",
  "/image/gallery/container.png",
  "/image/gallery/plant.png",
  "/image/gallery/machinery.png",
  "/image/gallery/products.png",
  "/image/gallery/products.png",
  "/image/gallery/products.png",
  "/image/gallery/products.png",
];
