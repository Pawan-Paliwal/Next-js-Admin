const CountryName = ({ children }) => {
  return (
    <p className="text-text/60 relative pl-[47px] font-bold transition-all duration-500 ease-linear before:absolute before:top-1/2 before:left-0 before:h-px before:w-[37px] before:-translate-y-1/2 before:bg-[#CFCFCF] before:transition-all before:duration-500 before:ease-linear 2xl:pl-[40%] 2xl:before:w-[55%]">
      {children}
    </p>
  );
};

export default CountryName;
