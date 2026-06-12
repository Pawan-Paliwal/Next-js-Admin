"use client";
import Image from "next/image";
import React, { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const WhatsList = ({ whatsNewData }) => {
  const [isActive, setIsActive] = useState(0);

  const data = whatsNewData
    ?.slice()
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map((item) => ({
      id: item.WhatsNewID,
      image: `/OnlineImages/WhatsnewImages/${item.WhatsNewImage}`,
      title: item.WhatsNewName,
      tagline: item.Tagline,
      article: item.Description,
      date: item.PostedDate,
    }));

  return (
    <section id="article" className="bg-background py-16">
      <div className="container grid grid-cols-[1fr_374px] gap-7">
        <div className="border border-[#C9C9C9]">
          <figure className="w-full">
            <Image
              className="block w-full object-cover"
              src={data?.[isActive].image}
              alt={data?.[isActive].title}
              width={1920}
              height={1080}
            />
          </figure>
          <figcaption className="bg-white p-10">
            <h3 className="text-gray mb-4 text-xl font-medium">
              {data?.[isActive].title}
            </h3>
            <article
              className="flex flex-col gap-4"
              dangerouslySetInnerHTML={{ __html: data?.[isActive].article }}
            />
          </figcaption>
        </div>

        <div className="scroll sticky top-[120px] max-h-[597px] overflow-y-auto">
          {data?.map(({ image, title }, i) => {
            const isRead = isActive === i;
            return (
              <div
                className={`grid cursor-pointer grid-cols-[97px_1fr] gap-6 border-[#E0E0E0] p-3 not-last:border-b ${isRead ? "bg-[#DEEBF1]" : "bg-white"}`}
                key={i}
                onClick={() => setIsActive(i)}
              >
                <figure className="h-[90px] w-[97px] overflow-hidden rounded-[4px]">
                  <Image
                    className="size-full object-cover"
                    src={image}
                    alt={title}
                    width={500}
                    height={500}
                  />
                </figure>
                <figcaption className="flex items-center text-sm leading-[20px]">
                  <p className={`${isRead ? "text-black" : ""}`}>{title}</p>
                </figcaption>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatsList;