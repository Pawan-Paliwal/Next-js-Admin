import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BlogHero = ({ title, date, image }) => {
  return (
    <section className="relative max-h-screen xl:h-[calc(80vh-var(--header-height))] h-[calc(100vh-var(--header-height))] overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(360deg,rgba(0,0,0,0.7)_9.57%,rgba(0,0,0,0)_59.57%)] before:content-['']">
      <Image
        className="block size-full object-cover"
        src={image || "/image/insight/banner.svg"}
        alt={title || "banner"}
        fill
      />
      <div className="absolute bottom-20 container">
        <p className="mb-6 text-xl font-medium text-white">{date}</p>
        <h1 className="max-w-[585px] text-[32px] leading-[38px] font-semibold text-white">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default BlogHero;