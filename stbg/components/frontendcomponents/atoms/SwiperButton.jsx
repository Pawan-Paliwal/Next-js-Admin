import Image from "next/image"

export default function SwiperButton({ classname="" }) {
    return(
        <button className={classname}>
            {/* <Image src="/assets/icon/next-black.svg" width="30" height="30" alt="Swiper Buttons"></Image> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M3 12h17.5"></path>
                    <path d="M21 12l-7 7M21 12l-7 -7"></path>
                </g>
            </svg>
        </button>
    )
}