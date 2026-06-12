import Link from "next/link";

export default function Button({ classname = "", linkHref = "", buttonText = "", onClick, ...rest }) {
    const isLink = Boolean(linkHref);
    const classList = classname.split(" ");
    const downArrow = classList.includes("down");
    const rightArrow = classList.includes("right");
    const topRightArrow = classList.includes("top-right");
    const Component = isLink ? Link : "button";
    const componentProps = {
        className: `btn shadow ${classname}`,
        onClick: !isLink ? onClick : undefined,
        ...(isLink ? { href: linkHref } : { type: "button" }),
        ...rest,
    };
    return (
        <Component {...componentProps}>
            {buttonText}

            {downArrow && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="22px" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l6-6m-6 6l-6-6"></path>
                </svg>
            )}
            {rightArrow && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 12l-6-6m6 6l-6 6m6-6H5"></path></svg>
            )}
            {topRightArrow && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="M768 256H353.6a32 32 0 1 1 0-64H800a32 32 0 0 1 32 32v448a32 32 0 0 1-64 0z"></path>
                    <path fill="currentColor" d="M777.344 201.344a32 32 0 0 1 45.312 45.312l-544 544a32 32 0 0 1-45.312-45.312z"></path>
                </svg>
            )}
        </Component>
    )
}