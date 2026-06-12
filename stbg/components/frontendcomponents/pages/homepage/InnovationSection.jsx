"use client"
import Image from "next/image"
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function InnovationSection() {
    useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const stickyWraps = document.querySelectorAll(".sticky-wrap");
    const stickySection = document.querySelector(".home-secC");
    const stickySec = document.querySelector(".sticky-sec");

    if (!stickySection || !stickyWraps.length) return;

    let completed = false;

    ScrollTrigger.matchMedia({

        "(min-width: 992px)": () => {
        ScrollTrigger.create({
            trigger: stickySection,
            start: "top 50px",
            end: `+=${stickyWraps.length * 20}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            markers: false,

            onUpdate(self) {
            if (completed) return;

            const progress = self.progress * (stickyWraps.length - 1);

            stickyWraps.forEach((wrap, index) => {
                wrap.classList.toggle("active", index <= progress);
            });

            stickySec?.classList.toggle(
                "all-active",
                Math.floor(progress) === stickyWraps.length - 1
            );

            if (self.progress >= 0.99) {
                completed = true;
                stickyWraps.forEach(wrap => wrap.classList.add("active"));
                stickySec?.classList.add("all-active");
                stickySection.classList.add("animate_completed");
            }
            }
        });
        },

    "(max-width: 992px)": () => {
      // ensure clean state on mobile
      stickyWraps.forEach(wrap => wrap.classList.remove("active"));
      stickySec?.classList.remove("all-active");
    }

  });

  return () => {
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}, []);



    return(
        <section>
            <div className="home-secC sec-pad">
                <div className="container">
                    <div className="heading">
                        <h2>This ecosystem is<span> already in motion</span></h2>
                    </div>
                    <div className="sticky-sec">
                        <div className="sticky-wrap">
                            <div className="fake-col"></div>
                        </div>
                        <div className="sticky-wrap">
                            <div className="cards_outer_col">
                                <div className="cards_col">
                                    <div className="icon">
                                        <Image src="/assets/images/home/card3.svg" width="50" height="50" alt="Card Icon"></Image>
                                    </div>
                                    <div className="content">
                                        <h5>10 Lakh+ Families Impacted</h5>
                                        <p>Families who trust the ecosystem, experiencing real value at every stage of their Healthcare Journey.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sticky-wrap">
                            <div className="cards_outer_col">
                                <div className="cards_col">
                                    <div className="icon">
                                        <Image src="/assets/images/home/card2.svg" width="50" height="50" alt="Card Icon"></Image>
                                    </div>
                                    <div className="content">
                                        <h5>100+ Institutional Partnerships</h5>
                                        <p>A growing network of hospitals, pharmaceuticals & healthcare partners working together to deliver more connected, efficient care.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sticky-wrap">
                            <div className="cards_outer_col">
                                <div className="cards_col">
                                    <div className="icon">
                                        <Image src="/assets/images/home/card1.svg" width="50" height="50" alt="Card Icon"></Image>
                                    </div>
                                    <div className="content">   
                                        <h5>30+ Major Cities Connected</h5>
                                        <p>Expanding nationwide through a connected healthcare network.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sticky-wrap">
                            <div className="cards_outer_col">
                                <div className="fake-col"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
