import Link from "next/link";

const VARIANTS = {
  primary: `relative bg-primary text-white  hover:bg-primary/80`,
  white: `relative bg-white text-primary  hover:bg-white/80`,
  outline: `relative bg-transparent border border-white text-white  hover:bg-white hover:text-primary`,
  outlinePrimary: `relative bg-transparent border border-primary text-primary  hover:bg-primary hover:text-white`,
};

const BASE_STYLE =
  "group text-nowrap inline-block  uppercase tracking-wider px-[10px] py-[8px] lg:px-[24px] lg:py-[12px] text-sm md:text-base font-poppins transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

const Button = ({
  href,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary",
  target = "_self",
  rel = "noopener noreferrer",
}) => {
  const classes = `${className} ${VARIANTS[variant]} ${BASE_STYLE}`;

  return href ? (
    <Link href={href} className={classes} target={target} rel={rel}>
      {children}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer ${classes}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
