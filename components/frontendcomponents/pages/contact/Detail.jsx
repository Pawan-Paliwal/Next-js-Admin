"use client";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ContactDetail = () => {
  const [activeLocation, setActiveLocation] = useState(0);

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(270deg,#0F8FC9_0%,#0B6B97_100%)] px-[15px] py-10 md:px-6 lg:px-14 md:py-14 lg:py-18 lg:pl-18">
      <Image
        src="/vector/icon.svg"
        alt="contact-bg"
        width={309}
        height={312}
        className="absolute -right-[116px] bottom-4"
      />

      <Heading className="text-center text-white! md:text-left">
        Contact Us
      </Heading>

      <div className="mt-7 md:mt-12">
        <div className="flex gap-5">
          <figure className="shrink-0">
            <Image
              className="size-[26px] md:size-[34px]"
              src="/icon/location.svg"
              alt="location"
              width={34}
              height={34}
            />
          </figure>
          <div>
            <ul className="flex gap-10">
              {["Head Office", "Corporate Office"].map((item, index) => {
                const isActive = activeLocation === index;
                return (
                  <li
                    key={item}
                    onClick={() => setActiveLocation(index)}
                    className={`relative cursor-pointer pb-2 text-base text-white before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-left before:bg-white before:transition-all before:duration-300 before:ease-in-out before:content-[''] md:text-lg ${isActive ? "opacity-100 before:scale-x-100" : "opacity-70 before:scale-x-0"}`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 md:mt-6">
              <p className="max-w-[294px] text-sm text-white/70 md:text-base">
                {data[activeLocation].address}
              </p>
              <Link
                target="_blank"
                className="mt-3 inline-flex items-center gap-4 text-sm text-white transition-transform duration-300 ease-in-out hover:translate-x-2 md:text-base"
                href="https://maps.app.goo.gl/Gbf6KErpQ7KqzNvp9"
              >
                Get Directions{" "}
                <Image
                  src="/icon/arrow-right.svg"
                  alt="arrow-right"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-5 md:mt-10">
          <figure className="shrink-0">
            <Image
              className="size-[22px] md:size-[25px]"
              src="/icon/email.svg"
              alt="location"
              width={25}
              height={22}
            />
          </figure>

          <div>
            <h4 className="mb-1 text-base text-white md:text-lg">Email</h4>
            <Link
              href={`mailto:${data[activeLocation].email}`}
              className="text-sm text-white/70 md:text-base"
            >
              {data[activeLocation].email}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex gap-5 md:mt-10">
          <figure className="shrink-0">
            <Image
              className="size-[24px] md:size-[34px]"
              src="/icon/call.svg"
              alt="location"
              width={34}
              height={34}
            />
          </figure>

          <div>
            <h4 className="mb-1 text-base text-white md:text-lg">Phone</h4>
            <Link
              href={`tel:${data[activeLocation].tel}`}
              className="block text-sm text-white/70 md:text-base"
            >
              Tel: {data[activeLocation].tel}
            </Link>
            <Link
              href={`tel:${data[activeLocation].mobile}`}
              className="block text-sm text-white/70 md:text-base"
            >
              Mob: {data[activeLocation].mobile}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;

const data = [
  {
    title: "Head Office",
    address: "Jorian, Delhi Road Yamunanagar - 135001, Haryana, India",
    mobile: "+91 779-850-008",
    tel: "1800-1216-209",
    email: "info@chanderpur.com",
  },
  {
    title: "Corporate Office",
    address: "F-5, Sec.-3, Noida - 201301, Uttar Pradesh, India",
    mobile: "+91 778-850-008",
    tel: "1800-1216-209",
    email: "info@chanderpur.com",
  },
];
