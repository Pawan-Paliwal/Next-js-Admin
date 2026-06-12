import Image from "next/image";

const PresenceIntro = () => {
  return (
    <section className="relative py-20">
      <div className="container grid grid-cols-2 gap-12">
        <figure className="roudned-md cover h-[330px] w-[520px] overflow-hidden">
          <video
            className="size-full rounded-md object-cover"
            src="/video/global.mp4"
            autoPlay
            loop
            muted
          ></video>
        </figure>
        <div className="flex flex-col justify-center">
          <h2 className="font-red-hat-display before:bg-primary relative text-4xl font-extrabold text-black before:absolute before:-bottom-5 before:h-[5px] before:w-[61px]">
            Our Presence
          </h2>
          <div className="mt-10 max-w-[524px]">
            <p className="text-lg">
              CPG is supplying{' '}
              <span className="font-medium">
                cement industries, mineral processing industries, waste to
                energy through gasification, lime industries, fertilizer
                industries, petrochemical industries, paper industries, flue gas
                desulfurization, contract and outsource manufacturing
              </span>{' '}
              to almost all parts of India, as well as across the globe.
            </p>
          </div>
        </div>
      </div>

      <Image
        src="/vector/icon-gray.svg"
        alt="icon"
        width={250}
        height={250}
        className="absolute top-1/2 right-0 -translate-y-1/2 grayscale-100"
      />
    </section>
  );
};

export default PresenceIntro;
