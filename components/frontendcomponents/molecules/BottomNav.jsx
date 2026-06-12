"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BottomNav = ({ data }) => {
  const [activeTab, setActiveTab] = useState(data[0].path);

  useEffect(() => {
    const getId = (path) => path.split("#")[1];

    const sections = data
      ?.map(({ path }) => document.getElementById(getId(path)))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = data.find(
              ({ path }) => getId(path) === entry.target.id,
            );
            if (matched) setActiveTab(matched.path);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80% 0px",
        threshold: 0,
      },
    );

    sections?.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="flex-center sticky bottom-6 z-5 mx-auto hidden h-[61px] max-w-[1048px] overflow-x-auto rounded-full bg-white px-10 shadow-[0px_5px_15px_0px_#00000059] md:flex">
      <ul className="flex items-center gap-[36px]">
        {data?.map(({ label, path }, index) => {
          const isActive = activeTab === path;
          return (
            <li key={index} onClick={() => setActiveTab(path)}>
              <Link
                className={`text-nowrap transition-all duration-500 ease-in-out ${isActive ? "text-primary font-bold" : "text-text/70"}`}
                href={path}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomNav;
