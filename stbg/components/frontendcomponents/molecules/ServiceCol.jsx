import Image from "next/image"
import Link from "next/link"
import "@/uploads/styles/component/component.css"
import Button from "../atoms/Button"

export default function ServiceCol({
    mediaType = "",
    mediaSrc = "",
    linkHref = "",
    classname = "",
    title = "",
    desc = "",
    procalyxTm = false,
    onClick
}) {

    const fixTM = (node) => {
        if (typeof node === "string") {
            return node.split("™").flatMap((part, i, arr) =>
                i < arr.length - 1
                    ? [part, <sup key={i} className="tm-tag">™</sup>]
                    : part
            );
        }
        if (Array.isArray(node)) {
            return node.map((child, i) => fixTM(child));
        }
        if (node?.props?.children) {
            return {
                ...node,
                props: {
                    ...node.props,
                    children: fixTM(node.props.children),
                },
            };
        }
        return node;
    };



    const renderTitle = procalyxTm ? fixTM(title) : title;


    return (
        <Link href={linkHref} className={`service_col item-md ${classname}`} onClick={onClick}>
            <figure>
                {mediaType === "video" ? (
                    <video src={mediaSrc} autoPlay muted loop playsInline></video>
                ) : (
                    <Image src={mediaSrc} width="800" height="600" alt="Service Image" />
                )}
            </figure>
            <figcaption>
                <h4>{renderTitle}</h4>
                <p>{desc}</p>
                <Button classname="white" buttonText="Explore More" />
            </figcaption>
        </Link>
    );
}