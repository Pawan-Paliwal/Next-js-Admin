const Tour = () => {
  return (
    <section className="relative h-[400px] overflow-hidden before:absolute before:inset-0 before:bg-black/20 before:content-[''] md:h-[40vh]  xl:h-[calc(100vh-var(--header-height))]">
      <video
        src="/video/360.mp4"
        autoPlay
        loop
        muted
        className="h-full w-full object-cover"
      />

      <div className="flex-center absolute top-1/2 left-1/2 hidden size-[229px] -translate-x-1/2 -translate-y-1/2 rounded-full before:absolute before:inset-0 before:rounded-full before:bg-[#D9D9D9] before:opacity-30 before:blur-[.5px] before:content-['']">
        <div className="animate-rotateBackForth absolute inset-0">
          {"3DTOUR"
            .repeat(4)
            .split("")
            .map((char, i) => (
              <span
                key={i}
                className="absolute top-1/2 left-1/2 text-[23.6px] font-semibold text-white uppercase"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-94px)`,
                }}
              >
                {char}
              </span>
            ))}
        </div>
        <div className="flex-center relative z-10 size-[111px] rounded-full border-2 border-white bg-black/10">
          <span className="relative text-3xl leading-[45px] font-medium text-white before:absolute before:-top-4 before:-right-1 before:text-[32px] before:content-['°']">
            360
          </span>
        </div>
      </div>
    </section>
  );
};

export default Tour;
