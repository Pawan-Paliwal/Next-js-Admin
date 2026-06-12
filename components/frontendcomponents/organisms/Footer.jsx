"use client";
import { FOOTER_NAVIGATIONS } from "@/constants/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "../atoms/Button";
import { SOCIAL_LINKS } from "@/constants/social";
import { useGetFooterDataQuery } from "@/store/frontendSlice/homePageAPISlice";

const Footer = () => {
  const { data: footerData, isLoading } = useGetFooterDataQuery();

  const turnkeyChildren = (footerData?.trunkeycategory ?? []).map((c) => ({
    label: c.TypeName,
    path: `/${c.TypeNameURL}`,
  }));

  const footerNavs = FOOTER_NAVIGATIONS.map((section) => {
    if (section.label === "Turnkey Projects") {
      if (isLoading || turnkeyChildren.length === 0) return section;
      return { ...section, children: turnkeyChildren };
    }
    return section;
  });
  return (
    <footer className="relative pb-[60px] before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(180deg,#FFFFFF_0%,#00adff21_100%)] before:content-[''] md:pb-0">
      <div className="absolute top-2 right-0 left-0 z-2 flex w-full items-center gap-[5px] md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-1/4 ${i === 0 ? "bg-yellow" : i === 1 ? " bg-primary " : i === 2 ? "bg-red" : " bg-green"}`}
          ></div>
        ))}
      </div>

      <div className="relative z-2 container flex flex-col gap-5 pt-10 pb-6 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-10 md:pb-10 lg:flex-nowrap lg:gap-10">
        <div className="w-full md:w-full lg:w-[25%]">
          <Link href="/">
            <Image
              className="w-[130px] lg:w-[182px]"
              src="/logo-large.svg"
              alt="Logo"
              width={182}
              height={78}
            />
          </Link>
          <h6 className="mt-4 text-left text-lg leading-[1.3] font-semibold uppercase md:text-xl xl:text-[26px]">
            Globally Preferred <br /> Engineering Conglomerate
          </h6>
          <p className="mt-2 text-left text-sm leading-[1.2] [word-spacing:0] md:max-w-full md:text-base lg:max-w-[80%]">
            An inspiration of speed, ethics, culture and value engineering
          </p>
        </div>

        {footerNavs.map(({ label, children }, i) => (
          <div
            className={
              i === 0
                ? "w-full md:w-[55%] lg:w-[30%]"
                : "w-full md:w-[40%] lg:w-[22%]"
            }
            key={i}
          >
            {label && (
              <h3 className="text-base font-semibold md:text-lg">{label}</h3>
            )}
            <ul className={`${label ? "mt-3" : ""}`}>
              {children.map(({ label, path }, idx) => (
                <li key={idx} className="not-last:mb-[6px] md:not-last:mb-2">
                  <Link
                    href={path}
                    className="hover:text-primary inline-flex items-start gap-3 text-sm font-medium transition-all duration-500 ease-in-out md:text-base"
                  >
                    <span className="border-primary bg-primary mt-2 block size-[8px] shrink-0 border transition-all duration-300 ease-in-out"></span>{" "}
                    {label}
                  </Link>
                </li>
              ))}
              {i === 0 && (
                <li className="mb-2">
                  <Link
                    href="/turnkey-projects"
                    className="text-primary inline-block text-sm font-medium transition-all duration-500 ease-in-out hover:translate-x-1 md:text-base"
                  >
                    View All
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
        <div className="md:w-[36%] lg:flex-1">
          <Button className="Capitalize! hidden! w-full items-center justify-center gap-2 bg-[#EAEAEA]! text-base! text-black! md:flex!">
            <Image
              className=""
              src="/icon/phone.svg"
              alt="phone"
              width={24}
              height={24}
            />{" "}
            Get in Touch
          </Button>

          <Button
            target="_blank"
            href="https://wa.me/919812056708"
            className="Capitlize! mt-6 hidden! w-full items-center justify-center gap-2 text-base! md:flex!"
          >
            <Image
              src="/icon/whatsapp.svg"
              alt="whatsapp"
              width={24}
              height={24}
            />{" "}
            WhatsApp
          </Button>

          <ul className="flex items-center justify-start gap-3 md:my-8">
            {SOCIAL_LINKS.slice(0, 5).map(({ label, path, icon }, i) => (
              <li className="" key={i}>
                <Link
                  target="_blank"
                  href={path}
                  className={`group flex-center border-primary size-[36px] rounded-full border bg-[linear-gradient(180deg,#FFFFFF_0%,#DDF4FF_100%)] transition-all duration-500 ease-in-out md:size-[43px] ${i === 0 ? "hover:border-[#0A66C2] hover:bg-[linear-gradient(180deg,#0A66C2)]" : i === 1 ? "hover:border-[#1877F2] hover:bg-[linear-gradient(180deg,#1877F2)]" : i === 2 ? "hover:border-[#E1306C] hover:bg-[linear-gradient(180deg,#E1306C)]" : i === 3 ? "hover:border-[#FF0000] hover:bg-[linear-gradient(180deg,#FF0000)]" : i === 4 ? "hover:border-[#E60023] hover:bg-[linear-gradient(180deg,#E60023)]" : " "}`}
                >
                  <Image
                    className="group-hover:brightness-0 group-hover:invert-100"
                    src={icon}
                    alt={label}
                    width={20}
                    height={20}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden flex-col md:flex">
            <span className="text-text mb-1">Connect us</span>
            <Link
              className="hover:text-primary transition-all duration-500 ease-in-out hover:translate-x-2"
              href="mailto:info@chanderpur.com"
            >
              info@chanderpur.com
            </Link>
          </div>
        </div>
      </div>

      <div className="border-border relative z-2 container flex flex-col items-center justify-between border-t py-[8px] md:flex-row md:py-6">
        <p className="flex items-center gap-2 text-[13px] text-black md:text-sm">
          &copy; CPG. All rights reserved.{" "}
          <span className="flex items-center gap-2">
            Made by{" "}
            <Link
              href="https://prettifycreative.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="w-[42px] md:w-[57px]"
                src="/prettify.svg"
                alt="Prettify"
                width={57}
                height={21}
              />
            </Link>
          </span>
        </p>

        <ul className="flex items-center gap-4">
          {["terms-of-service", "privacy-policy"].map((item, index) => (
            <li key={index}>
              <Link
                href={`/${item}`}
                className="text-muted-foreground text-[13px] text-black capitalize md:text-sm"
              >
                {item.split("-").join(" ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
