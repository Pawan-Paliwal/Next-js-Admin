import Button from "@/components/frontendcomponents/atoms/Button";
import Image from "next/image";
import Link from "next/link";

const FeaturedBlogCard = ({ image, title, date, slug }) => {
  return (
    <figure className="relative h-[441px] w-full overflow-hidden rounded-md before:absolute before:inset-0 before:z-1 before:hidden before:bg-[linear-gradient(180deg,rgba(0,0,0,0)_34.69%,rgba(0,0,0,0.7)_67.01%)] before:transition-all before:duration-700 before:ease-in before:content-['']">
      <Image
        className="size-full rounded-md object-cover"
        src={image}
        alt=""
        fill
      />

      <figcaption className="pointer-events-none absolute right-0 bottom-0 left-0 z-2 px-10 pb-12 opacity-0 transition-all duration-700 ease-in-out">
        <h5 className="mb-6 max-w-[95%] text-xl font-medium text-white">
          {title}
        </h5>
        {date && <p className="font-medium text-white">{date}</p>}
        <Button
          href={`/blogs/${slug}`}
          variant="outline"
          className="py-10px! absolute! right-10 bottom-8 flex! items-center gap-2 rounded-xl text-sm! capitalize!"
        >
          Read More
          <Image src="/icon/right-white.svg" alt="" width={11} height={22} />
        </Button>
      </figcaption>
    </figure>
  );
};

export default FeaturedBlogCard;
