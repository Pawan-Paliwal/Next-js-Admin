const PresenceHero = () => {
  return (
    <section className="beforeto:to-white relative h-[501px] overflow-hidden before:absolute before:inset-0 before:z-2 before:bg-linear-to-r before:from-[#f6f6f6] before:to-50% before:content-['']">
      <div className="container relative flex h-full items-center">
        <div className="border-primary z-3 border-l-4 pl-7">
          <h2 className="mb-3 text-5xl font-bold">CPG Worldwide</h2>
          <p className="max-w-[457px] text-xl">
            A legacy since 1962, now with a global footprint, trusted engineering solutions on every continent.
          </p>
        </div>
        <video
          className="absolute top-1/2 -right-[25%] z-1 -translate-y-1/2 -scale-x-100"
          src="/video/world.mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
    </section>
  );
};

export default PresenceHero;
