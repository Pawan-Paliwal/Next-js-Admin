'use client';
import Button from "@/components/frontendcomponents/atoms/Button";
import Image from "next/image";
import React from "react";

const SectionIntro = ({ activeCategories = [] }) => {
  return (
    <>
      {activeCategories.map((item, i) => {
        const isEven = i % 2 === 0;
        return (
          <section key={item.CategoryID} className="py-20">
            <div className="container grid grid-cols-2 gap-20">
              {isEven ? (
                <>
                  <div>
                    <h3 className="text-gray text-2xl font-medium">
                      {item.CategoryName}
                    </h3>
                    <p className="mt-5">{item.SmallDescription}</p>
                    <Button
                      href={`/${item.CategoryNameURL}`}
                      className="mt-6"
                    >
                      Know More
                    </Button>
                  </div>
                  <figure className="h-[299px] overflow-hidden rounded-md">
                    <Image
                      alt={item.CategoryName}
                      src={`/OnlineImages/FacilitycategoryImages/${item.CategoryImage}`}
                      className="size-full object-cover"
                      width={1920}
                      height={1080}
                    />
                  </figure>
                </>
              ) : (
                <>
                  <figure className="h-[299px] overflow-hidden rounded-md">
                    <Image
                      alt={item.CategoryName}
                      src={`/OnlineImages/FacilitycategoryImages/${item.CategoryImage}`}
                      className="size-full object-cover"
                      width={1920}
                      height={1080}
                    />
                  </figure>
                  <div>
                    <h3 className="text-gray text-2xl font-medium">
                      {item.CategoryName}
                    </h3>
                    <p className="mt-5">{item.SmallDescription}</p>
                    <Button
                      href={`/${item.CategoryNameURL}`}
                      className="mt-6"
                    >
                      Know More
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default SectionIntro;