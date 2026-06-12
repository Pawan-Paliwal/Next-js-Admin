const Heading = ({ children, className = "", right }) => {
  return (
    <div className="flex items-center justify-between">
      <h2
        className={`font-heading font-red-hat-display w-full text-2xl leading-[1.2] font-bold md:text-3xl lg:text-[42px] xl:text-5xl ${className}`}
      >
        {children}
      </h2>
      {right && right}
    </div>
  );
};

export default Heading;
