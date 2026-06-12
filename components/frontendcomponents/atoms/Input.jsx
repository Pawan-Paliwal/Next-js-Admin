const Input = ({
  variant = "",
  isLight = false,
  label,
  type = "text",
  name,
  id,
  onChange,
  value,
  placeholder = " ",
  required = false,
  className = "",
  error,
}) => {
  return (
    <label className="relative h-full w-full">
      <input
        name={name}
        id={id || name}
        onChange={onChange}
        value={value}
        type={type}
        className={`peer w-full border-b ${className} bg-transparent pb-1 transition-all duration-500 ease-in-out outline-none ${type === "number" ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" : ""} ${isLight ? "border-white/70 text-white/70 focus:border-white" : `${error ? "border-red-500" : "border-border"} focus:border-primary text-text`}`}
        placeholder={placeholder}
        required={required}
      />
      <span
        className={`pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-base transition-all duration-300 peer-not-placeholder-shown:-top-[15px] peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:-top-[15px] peer-focus:translate-y-0 peer-focus:text-xs ${isLight ? "text-white/70" : "text-text"}`}
      >
        {label}
      </span>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
};

export default Input;