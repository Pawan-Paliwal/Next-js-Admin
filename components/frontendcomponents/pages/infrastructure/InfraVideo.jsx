import Heading from "@/components/frontendcomponents/atoms/Heading";

const InfraVideo = () => {
  return (
    <section className="py-20 z-2 bg-primary">
      <div className="container">
        <Heading className="text-center text-white">Video Gallery</Heading>

        <div className="mt-16 grid grid-cols-2 gap-5">
          {data?.map(({ video, title }, i) => {
            return (
              <figure
                key={i}
                className="relative h-[316px] overflow-hidden rounded-sm before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_0%,rgba(102,102,102,0)_100%)]"
              >
                <video
                  className="size-full object-cover object-center"
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  webkit-playsline="true"
                ></video>
                <figcaption className="absolute bottom-0 right-0 left-0 p-6">
                  <h4 className="text-center font-semibold text-xl text-white">{title}</h4>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InfraVideo;

const data = [
  {
    video: "/video/Manufacturing 1.mp4",
    title: "Integrated Infrastructure Solutions",
  },
  {
    video: "/video/Manufacturing 2.mp4",
    title: "Strategic Location Advantages",
  },
  {
    video: "/video/Manufacturing 3.mp4",
    title: "Production Excellence",
  },
  {
    video: "/video/Manufacturing 4.mp4",
    title: "Quality and Safety Standards",
  },
];
