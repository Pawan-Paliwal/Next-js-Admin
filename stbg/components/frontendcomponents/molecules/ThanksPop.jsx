"use client"
import { useModalStore } from "@/store/modalStore";
import "@/uploads/styles/component/component.css"
export default function ThanksPop() {
    const isThankyouOpen = useModalStore((state) => state.isThankyouOpen)
    const thankyouMessage = useModalStore((state) => state.thankyouMessage)
    const closeThankyouPop = useModalStore((state) => state.closeThankyouPop)
    return (
        <div className={`model thank-you ${isThankyouOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closeThankyouPop}>
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
                <div className="thankyou_wrapper">
                    <h2>Thank You !</h2>
                    <p>{thankyouMessage}</p>
                </div>
            </div>
        </div>
    )
}