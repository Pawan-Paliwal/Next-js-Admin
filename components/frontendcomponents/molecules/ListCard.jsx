import Image from "next/image";
import Link from "next/link";

const ListCard = ({ title, image, descriptionTitle, description, link }) => {
  return (
    <>
      <div className="group perspective-[1000px]">
        <div className="h-[265px] w-full">
          <div className="relative h-full w-full transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)]">
            <figure className="absolute inset-0 z-1 h-full w-full overflow-hidden rounded-md backface-hidden before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.65)_0%,rgba(102,102,102,0)_57.21%)]">
              <Image src={image} alt={title} fill className="object-cover" />
              <figcaption className="absolute right-0 bottom-0 left-0 z-2 px-5 pb-9 text-center text-xl font-medium text-white">
                {title}
              </figcaption>
            </figure>

            <div className="bg-primary absolute inset-0 z-2 flex h-full w-full transform-[rotateY(180deg)] flex-col justify-between rounded-md px-8 py-6 backface-hidden">
              <h4 className="relative text-[22px] font-medium text-white before:absolute before:-bottom-3 before:h-1 before:w-8 before:bg-white">
                {descriptionTitle || title}
              </h4>

              <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="scroll mt-6 mb-3 max-h-[102px] overflow-y-auto text-sm [&_ul]:mb-2 [&_ul>li]:relative [&_ul>li]:border-white [&_ul>li]:pl-4 [&_ul>li]:before:absolute [&_ul>li]:before:top-2 [&_ul>li]:before:left-0 [&_ul>li]:before:size-[7px] [&_ul>li]:before:border [&_ul>li]:before:bg-white [&_ul>li>strong]:font-semibold [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-white/10 [&>p]:mb-2 [&>p]:text-white/80 [&>ul>li]:text-white/80"
              />

              <Link
                className="flex-center pointer-events-auto size-[38px] shrink-0 rounded-full bg-white transition-all duration-500 hover:translate-x-1"
                href={link}
              >
                <Image
                  src="/icon/right-arrow-blue.svg"
                  alt="arrow-right"
                  width={24}
                  height={24}
                />
              </Link>

              <Image
                className="absolute -right-7 -bottom-4 z-2 opacity-60"
                src="/vector/icon.svg"
                alt="arrow-right"
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListCard;
