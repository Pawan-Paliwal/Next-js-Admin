"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function FinancialSec({ data, ref }) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    const section = document.querySelector(".swasth-secC.sec-pad-all");
    const cardWrapper = document.querySelector(".card_wrapper");
    const financialWrapper = document.querySelector(".financial_wrapper");

    if (!section || !cardWrapper || !financialWrapper) return;

    let timeoutId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hard stop if already executed once
        if (!entry.isIntersecting || hasRunRef.current) return;

        hasRunRef.current = true;

        cardWrapper.classList.remove("active");
        financialWrapper.classList.remove("active");

        cardWrapper.classList.add("active");

        timeoutId = setTimeout(() => {
          financialWrapper.classList.add("active");
        }, 1000);

        // Stop observing after first execution
        observer.unobserve(section);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -60% 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  if (!data) return null;

  const getIconPath = (filename) => {
    if (!filename) return null;
    return `/OnlineImages/ProductImages/${filename}`;
  };

  return (
    <section>
      <div className="swasth-secC sec-pad-all" ref={ref}>
        <div className="container">
          <div className="heading">
            <h2>
              {data.title} <span>{data.subtitle}</span>
            </h2>
          </div>

          <div className="financial_wrapper">
            <div className="card_wrapper">
              <figure>
                {data.mediaUrl && (
                  <Image
                    src={data.mediaUrl}
                    width="450"
                    height="330"
                    alt=""
                    className="card"
                  />
                )}
              </figure>
            </div>

            {data.items?.map((item) => (
              <div className="finance_col" key={item.ItemId}>
                <div className="icon">
                  {item.ItemIconUrl && (
                    <Image
                      src={getIconPath(item.ItemIconUrl)}
                      width="50"
                      height="50"
                      alt="Finance Icon"
                    />
                  )}
                </div>
                <p>{item.ItemTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
