"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function BenefitsSec({ data = {}, ref }) {
  const {
    title = "",
    subtitle = "",
    mediaUrl = "",
    items = [],
  } = data;

  const hasRunRef = useRef(false);

  useEffect(() => {
    const section = document.querySelector(".swarth_corp_A.sec-pad"); 
    const cardWrapper = document.querySelector(".card_wrapper");
    const benefitsWrapper = document.querySelector(".benefits_wrapper");

    if (!section || !cardWrapper || !benefitsWrapper) return;

    let timeoutId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRunRef.current) return;

        hasRunRef.current = true;

        cardWrapper.classList.remove("active");
        benefitsWrapper.classList.remove("active");

        cardWrapper.classList.add("active");

        timeoutId = setTimeout(() => {
          benefitsWrapper.classList.add("active");
        }, 1000);

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

  return (
    <section>
      <div className="swarth_corp_A sec-pad" ref={ref}>
        <div className="container">
          <div className="heading">
            <h2>
              {title} <span>{subtitle}</span>
            </h2>
          </div>

          <div className="benefits_wrapper">
            <div className="card_wrapper">
              {mediaUrl && (
                <figure>
                  <Image
                    src={mediaUrl}
                    width="450"
                    height="330"
                    alt=""
                    className="card"
                  />
                </figure>
              )}
            </div>

            {items.map((item) => (
              <div className="benefits_col" key={item.ItemId}>
                <div className="icon">
                  <Image
                    src={`/OnlineImages/ProductImages/${item.ItemIconUrl}`}
                    width="50"
                    height="50"
                    alt={item.ItemTitle}
                  />
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
