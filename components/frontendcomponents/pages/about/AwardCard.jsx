import Image from "next/image";
import Link from "next/link";

const AwardCard = ({ image, title }) => {
  return (
    <div className="w-full flex-center flex-col">
      <Link data-fancybox="awards" href={image} className=" bg-white">
        <figure className="w-full rounded-md overflow-hidden flex-center h-[399px]">
          <Image
            className="w-fit h-full object-contain transition-all duration-500 ease-in-out"
            src={image}
            alt={title}
            width={1080}
            height={1920}
          />
        </figure>
      </Link>
      <figcaption className="text-center hidden mt-7 transition-all duration-500 ease-in-out font-semibold text-black">
        {title}
      </figcaption>
    </div>
  );
};

export default AwardCard;
