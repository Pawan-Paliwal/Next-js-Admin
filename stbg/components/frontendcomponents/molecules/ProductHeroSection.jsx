import Image from "next/image";
import "@/uploads/styles/component/component.css"
import Button from "../atoms/Button";

export default function ProductHeroSection({ classname = "", heading = "Heading Here", subHeading = "Subheading Here", btnText , btnClass="down fw-bold", mediaType = "video", mediaSrc = "assets/video/swasth_banner.mp4", videoPoster = "assets/video/swasth_banner_poster.png", linkHref = "", onClick }) {
  return (
    <section>
      <div className={`product_herosec sec-pad-all ${classname}`}>
        <div className="container">
          <div className="main_wrapper flex">
            <div className="colA">
              <div className="heading">
                <h1>{heading}</h1>
                {/* <p>{subHeading}</p> */}
                <p dangerouslySetInnerHTML={{ __html: subHeading }} />
                 {btnText && (
                  <Button classname={btnClass} buttonText={btnText} linkHref={linkHref} onClick={onClick} />
                )}
              </div>
            </div>
            <div className="colB">
              <figure>
                {mediaType === "video" ? (
                  <video
                    src={mediaSrc}
                    poster={videoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                  ></video>
                ) : (
                  <Image
                    src={mediaSrc}
                    width="600"
                    height="450"
                    alt="Hero Section Media"
                  ></Image>
                )}
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
