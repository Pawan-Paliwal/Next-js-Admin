"use client"
import Image from "next/image"
import { useEffect } from "react";

export default function MedicalIntegrated({ data = {} }) {
    const {
        title = "",
        subtitle = "",
        mediaUrl = "",
        items = []
    } = data;

    useEffect(() => {
        const section = document.querySelector('.amya_wellness_A.sec-pad-all');
        const cardWrapper = document.querySelector('.card_wrapper');
        const amyaWrapper = document.querySelector('.amya_wrapper');
        if (!section || !cardWrapper || !amyaWrapper) return;

        let timeoutId;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    cardWrapper.classList.remove('active');
                    amyaWrapper.classList.remove('active');
                    cardWrapper.classList.add('active');

                    timeoutId = setTimeout(() => {
                        amyaWrapper.classList.add('active');
                    }, 1000);
                } else {
                    cardWrapper.classList.remove('active');
                    amyaWrapper.classList.remove('active');
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                }
            },
            {
                threshold: 0,
                rootMargin: '0px 0px -60% 0px',
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
            <div className="amya_wellness_A sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h2>
                            {title} <span>{subtitle}</span>
                        </h2>
                    </div>
                    <div className="amya_wrapper">
                        <div className="card_wrapper">
                            {mediaUrl && (
                                <figure>
                                    <Image src={mediaUrl} width="450" height="330" alt="" className="card"></Image>
                                </figure>
                            )}
                        </div>
                        {items.map((item) => (
                            <div className="amya_col" key={item.ItemId}>
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
    )
}