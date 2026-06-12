"use client"
import Image from "next/image"
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import "swiper/css/autoplay";
import "swiper/css/pagination";

export default function JourneySec({ TimelineData }) {
    // function updateJourneyBullets(activeIndex) {
    //     const bullets = document.querySelectorAll(
    //         ".about-journey-pagination .journey-btn"
    //     );
    //     bullets.forEach((btn, index) => {
    //         btn.classList.remove("prev", "next");

    //         if (index < activeIndex) btn.classList.add("prev");
    //         if (index > activeIndex) btn.classList.add("next");
    //     });
    // }

    const [itemsPerRow, setItemsPerRow] = useState(4);
    const [isMobile, setIsMobile] = useState(false);

    const timelineArray = Array.isArray(TimelineData) ? TimelineData : [];

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setIsMobile(true);
                setItemsPerRow(timelineArray.length);
            } else if (width >= 768 && width < 992) {
                setIsMobile(false);
                setItemsPerRow(2);
            } else if (width >= 992 && width < 1170) {
                setIsMobile(false);
                setItemsPerRow(3);
            }
            else {
                setIsMobile(false);
                setItemsPerRow(4);
            }
        };
        // Set initial value
        handleResize();
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (timelineArray.length === 0) {
        return null;
    }

    // Split data into rows
    const createRows = () => {
        if (isMobile) {
            // Below 768px: all items in upper_row
            return [timelineArray];
        }

        // For larger screens: split into rows
        const rows = [];
        for (let i = 0; i < timelineArray.length; i += itemsPerRow) {
            rows.push(timelineArray.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    const rows = createRows();

    return (
        <section>
            <div className="journey_sec sec-pad">
                <div className="container">
                    <div className="main_wrapper">
                        <div className="heading">
                            <h2>
                                A Decade of Bridging the Gap Between{" "}
                                <span>Healthcare</span> and{" "}
                                <span>Affordability</span>
                            </h2>
                        </div>
                        {/* <div className="navigation_wrap">
                            <div className="about-journey-pagination"></div>
                        </div> */}

                        {/* <div className="about_journey_wrap">
                            <div className="journey-nav swiper-nav center-full">
                                <button type="button" className="about-journey-prev swiper-prev">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#fff" strokeWidth={1.7} d="m7 2l10 10L7 22"></path>
                                    </svg>
                                </button>
                                <button type="button" className="about-journey-next swiper-next">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#fff" strokeWidth={1.7} d="m7 2l10 10L7 22"></path>
                                    </svg>
                                </button>
                            </div>

                            <Swiper
                                modules={[Navigation, Autoplay, Pagination]}
                                className="about_journey_slider"
                                slidesPerView={1}
                                spaceBetween={20}
                                speed={1500}
                                loop={false}
                                // autoplay={{
                                //     delay: 2000,
                                //     pauseOnMouseEnter: true,
                                //     disableOnInteraction: false,
                                // }}
                                navigation={{
                                    prevEl: ".about-journey-prev",
                                    nextEl: ".about-journey-next",
                                }}
                                pagination={{
                                    el: ".about-journey-pagination",
                                    clickable: true,
                                    bulletClass: "journey-btn",
                                    bulletActiveClass: "active",
                                    renderBullet: (index, className) => `
                                        <button type="button" class="${className}">
                                            <span></span>
                                            <p>${timelineArray[index]?.TimelineYear || ''}</p>
                                        </button>
                                    `,
                                }}
                                onInit={(swiper) => {
                                    updateJourneyBullets(swiper.activeIndex);
                                }}
                                onSlideChange={(swiper) => {
                                    updateJourneyBullets(swiper.activeIndex);
                                }}
                            >
                                {timelineArray.map((item) => (
                                    <SwiperSlide key={item.TimelineID}>
                                        <div className="year" data-year={item.TimelineYear}>
                                            <figcaption>
                                                <div className="content">
                                                    <h5>{item.TimelineName}</h5>
                                                    <p>{item.Description}</p>
                                                </div>
                                            </figcaption>
                                            <figure>
                                                <Image
                                                    src={`/OnlineImages/TimelineImages/${item.TimelineImage}`}
                                                    width={450}
                                                    height={320}
                                                    alt={`Journey ${item.TimelineYear}`}
                                                />
                                            </figure>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div> */}
                        <div className="journey_wrap">
                            {rows.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className={isMobile || rowIndex % 2 === 0 ? "upper_row" : "lower_row"}
                                >
                                    {row.map((item) => (
                                        <div key={item.TimelineID} className="journey_col">
                                            <span className="year">{item.TimelineYear}</span>
                                            <div className="dot"></div>
                                            <div className="content">
                                                <h5>{item.TimelineName}</h5>
                                                <p>{item.Description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}