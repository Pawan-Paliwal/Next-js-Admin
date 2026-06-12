import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  return (
    <ul className="bg-primary fixed right-0 bottom-0 left-0 z-5 grid h-[60px] grid-cols-3 items-center justify-between md:hidden">
      {data?.map(({ title, icon, href }, i) => {
        return (
          <li className="size-full border-white/20 not-last:border-r" key={i}>
            <Link
              target={i === 1 ? "_blank" : "_self"}
              className="flex-center size-full flex-col"
              href={href}
            >
              <Image
                className="brightness-0 invert-100"
                src={icon}
                alt={title}
                width={22}
                height={22}
              />
              <span className="text-[13px] font-normal text-white">
                {title}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CTA;

const data = [
  {
    title: "Phone",
    icon: "/icon/phone-blue.svg",
    href: "tel:919812056708",
  },
  {
    title: "WhatsApp",
    icon: "/icon/whatsapp-large.svg",
    href: "https://wa.me/919812056708",
  },
  {
    title: "Enquire Now",
    icon: "/icon/question-blue.svg",
    href: "/contact-us",
  },
];
