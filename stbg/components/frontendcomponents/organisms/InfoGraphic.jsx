// import Image from "next/image"
// import "@/uploads/styles/component/component.css"
// import Button from "../atoms/Button"

// export default function InfoGraphic({ classname = "", imgSrc = "", heading = "", desc = "", btnType = "button", btnClass = "white", btnText = "", linkHref = "", onClick, ...rest }) {


//     return (
//         <section>
//             <div className={`info_graphic sec-pad-all ${classname}`}>
//                 <div className="container">
//                     <div className="main_wrapper">
//                         <div className="colA">
//                             <figure>
//                                 <Image src={imgSrc} width="450" height="330" alt="" className="card"></Image>
//                             </figure>
//                         </div>
//                         <figcaption>
//                             <div className="content heading">
//                                 <h2>{heading}</h2>
//                                 <div className="desc">{desc}</div>
//                                 <Button classname={btnClass} buttonText={btnText} linkHref={linkHref} onClick={onClick} {...rest} />
//                             </div>
//                         </figcaption>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

// import Image from "next/image"
// import "@/uploads/styles/component/component.css"
// import Button from "../atoms/Button"
// import React from "react";

// export default function InfoGraphic({ classname = "", imgSrc = "", heading = "", desc = "", btnType = "button", btnClass = "white", btnText = "", linkHref = "", onClick, ...rest }) {
//     const fixTM = (node) => {
//         // Handle plain text
//         if (typeof node === "string") {
//             // If already contains ProCalyx™ → convert to sup
//             if (node.includes("ProCalyx™")) {
//                 return node.split(/(ProCalyx™)/g).map((part, i) =>
//                     part === "ProCalyx™" ? (
//                         <React.Fragment key={i}>
//                             ProCalyx<sup className="tm-tag">™</sup>
//                         </React.Fragment>
//                     ) : (
//                         part
//                     )
//                 );
//             }

//             // If contains ProCalyx (but NOT ™) → add ™
//             if (node.includes("ProCalyx")) {
//                 return node.split(/(ProCalyx)/g).map((part, i) =>
//                     part === "ProCalyx" ? (
//                         <React.Fragment key={i}>
//                             ProCalyx<sup className="tm-tag">™</sup>
//                         </React.Fragment>
//                     ) : (
//                         part
//                     )
//                 );
//             }

//             return node;
//         }

//         // Handle arrays safely
//         if (Array.isArray(node)) {
//             return node.map((child) => fixTM(child));
//         }

//         // Preserve JSX elements exactly
//         if (node?.props?.children) {
//             return {
//                 ...node,
//                 props: {
//                     ...node.props,
//                     children: fixTM(node.props.children),
//                 },
//             };
//         }

//         return node;
//     };

//     return (
//         <section>
//             <div className={`info_graphic sec-pad-all ${classname}`}>
//                 <div className="container">
//                     <div className="main_wrapper">
//                         <div className="colA">
//                             <figure>
//                                 <Image src={imgSrc} width="450" height="330" alt="" className="card"></Image>
//                             </figure>
//                         </div>
//                         <figcaption>
//                             <div className="content heading">
//                                 <h2>{fixTM(heading)}</h2>
//                                 <div className="desc">{desc}</div>
//                                 <Button classname={btnClass} buttonText={btnText} linkHref={linkHref} onClick={onClick} {...rest} />
//                             </div>
//                         </figcaption>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

import Image from "next/image"
import "@/uploads/styles/component/component.css"
import Button from "../atoms/Button"

export default function InfoGraphic({
    classname = "",
    imgSrc = "",
    heading = "",
    desc = "",
    btnType = "button",
    btnClass = "white",
    btnText = "",
    linkHref = "",
    onClick,
    procalyxTm = false,
    ...rest
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


    const renderHeading = procalyxTm ? fixTM(heading) : heading;


    return (
        <section>
            <div className={`info_graphic sec-pad ${classname}`}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="colA">
                            <figure>
                                <Image src={imgSrc} width="450" height="330" alt="" className="card" />
                            </figure>
                        </div>
                        <figcaption>
                            <div className="content heading">
                                <h2>{renderHeading}</h2>
                                <div className="desc">{desc}</div>
                                <Button
                                    classname={btnClass}
                                    buttonText={btnText}
                                    linkHref={linkHref}
                                    onClick={onClick}
                                    {...rest}
                                />
                            </div>
                        </figcaption>
                    </div>
                </div>
            </div>
        </section>
    );
}
