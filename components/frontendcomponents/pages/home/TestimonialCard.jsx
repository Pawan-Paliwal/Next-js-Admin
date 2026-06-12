import Image from "next/image";

const TestimonialCard = ({ logo, organization, review }) => {
  return (
    <div className="mx-auto flex w-full flex-col rounded-lg bg-white p-6 shadow-[0px_3px_42.4px_-28px_#0000003D] md:w-[95%] md:p-10 lg:w-[70%] xl:w-[60%] 2xl:w-[80%]">
      <div className="mb-[18px] flex flex-1 justify-between gap-3 md:gap-[52px]">
        <p
          className="text-justify text-sm wrap-break-word md:text-base"
          dangerouslySetInnerHTML={{ __html: review }}
        />
        <figure className="hidden shrink-0 md:block">
          <Image
            className="size-[34px] md:size-[68px]"
            src="/icon/quote.svg"
            alt=""
            width={68}
            height={68}
          />
        </figure>
      </div>
      <div className="flex items-center gap-[18px]">
        <figure className="flex-center h-[48px] w-[40%] p-4 md:h-[99px] md:w-[150px]">
          <Image src={logo} alt={organization} width={500} height={450} />
        </figure>
        <figcaption className="max-w-[250px] text-base leading-[1.2] font-bold md:text-xl">
          {organization}
        </figcaption>
      </div>
    </div>
  );
};

export default TestimonialCard;
