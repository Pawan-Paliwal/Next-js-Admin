

const TechCard = ({ title, image, detail }) => {
  return (
    <div className="content flex h-full w-full flex-col rounded-md bg-white px-16 py-10">
      <h4 className="title flex items-center justify-between text-[24px] font-medium text-black">
        {title}
      </h4>
      <div
        dangerouslySetInnerHTML={{ __html: detail }}
        className="scroll detail [&>ul>li]:text-text mt-6 mb-3 max-h-fit overflow-y-auto [&_ul]:mb-2 [&_ul>li]:relative [&_ul>li]:border-white [&_ul>li]:pl-4 [&_ul>li]:not-last:mb-1 [&_ul>li]:before:absolute [&_ul>li]:before:top-2.5 [&_ul>li]:before:left-0 [&_ul>li]:before:size-[4px] [&_ul>li]:before:rounded-full [&_ul>li]:before:border [&_ul>li]:before:bg-white/70 [&_ul>li>strong]:font-semibold [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-white/10 [&>p]:mb-2 [&>p]:text-white/80"
      />
    </div>
  );
};

export default TechCard;
