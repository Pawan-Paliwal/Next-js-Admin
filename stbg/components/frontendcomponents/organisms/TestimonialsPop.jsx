"use client"
import Image from "next/image";
import "@/uploads/styles/component/component.css"
import { useModalStore } from "@/store/modalStore";

export default function TestimonialPop() {
    const isTestimonialOpen = useModalStore((state) => state.isTestimonialOpen)
    const closeTestimonialPop = useModalStore((state) => state.closeTestimonialPop)
    const selectedTestimonial = useModalStore((state) => state.selectedTestimonial)

    if (!selectedTestimonial) return null;

    return (
        <div className={`model testimonials-pop ${isTestimonialOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closeTestimonialPop}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className="model-body">
                <div className="team_wrapper">
                    <figure>
                        <Image
                            src={selectedTestimonial.TestimonialImage ? `/OnlineImages/TestimonialImages/${selectedTestimonial.TestimonialImage}` : "/assets/images/placeholder.png"}
                            width={120}
                            height={120}
                            alt={selectedTestimonial.TestimonialName || "Testimonial"}
                        />
                    </figure>
                    <figcaption>
                        <div className="heading">
                            <h6>{selectedTestimonial.TestimonialName || ""}</h6>
                            <p>{selectedTestimonial.Location || ""}</p>
                        </div>
                        <div
                            className="team_details"
                            dangerouslySetInnerHTML={{
                                __html: selectedTestimonial.Description || ""
                            }}
                        />
                    </figcaption>
                </div>
            </div>
        </div>
    )
}
