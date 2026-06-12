import Image from "next/image";
import Button from "@/components/frontendcomponents/atoms/Button"
export default function HealthcareSec({ data, onClick }) {
    if (!data) return null;

    return (
        <section>
            <div className="swasth-secB sec-pad-all">
                <div className="container">
                    <div className="main_wrapper">
                        <figcaption>
                            <div className="content heading">
                                <h2>{data.title} <span>{data.subtitle}</span></h2>
                                <p>{data.description}</p>
                               {data.buttonText && (
                                    <Button classname="white down" buttonText={data.buttonText} onClick={onClick} />
                                )}
                            </div>
                        </figcaption>
                        <figure>
                            {data.mediaUrl && (
                                <Image src={data.mediaUrl} width="450" height="330" alt="" className="card" />
                            )}
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    )
}