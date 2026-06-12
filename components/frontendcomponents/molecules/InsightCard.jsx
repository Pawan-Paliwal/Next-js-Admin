import Image from "next/image";
import Link from "next/link";

const InsightCard = ({ image, title, slug, date, name }) => {
  console.log("thename",name)
  const href = name ? `${slug}` : `/blogs/${slug}`;

  return (
    <div className="group overflow-hidden rounded-md shadow-[0px_8px_24px_0px_#959DA533] bg-white">
      <figure className="h-[254px] overflow-hidden">
        <Link href={href}>
          <Image className="transition-transform size-full object-cover duration-500 ease-in-out group-hover:scale-110 w-full" src={image} alt={title} width={1920} height={1080} />
        </Link>
      </figure>
      <figcaption className="p-5">
        <h5 className="font-poppins mb-4 text-base leading-[1.2] md:text-lg md:leading-6 font-semibold">
          {title}
        </h5>
        <p className="font-poppins md:text-base text-sm leading-6 font-normal">{date}</p>
      </figcaption>
    </div>
  );
};

export default InsightCard;