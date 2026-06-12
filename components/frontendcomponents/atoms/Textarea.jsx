const Textarea = ({
  variant = "",
  isLight = false,
  label,
  name,
  id,
  onChange,
  value,
  placeholder = "",
  rows = 1,
  className = "",
  required = false,
}) => {
  return (
    <label className={`relative w-full ${className}`}>
      <textarea
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`peer w-full border-b bg-transparent pb-1 transition-all duration-500 ease-in-out outline-none ${isLight ? "border-white/70 text-white/70 focus:border-white " : "border-border focus:border-primary text-text"}`}
      />
      <span
        className={`pointer-events-none absolute top-[10px] left-0 -translate-y-1/2 text-base transition-all duration-300 peer-not-placeholder-shown:-top-[15px] peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:-top-[15px] peer-focus:translate-y-0 peer-focus:text-xs ${isLight ? "text-white/70" : "text-text"}`}
      >
        {label}
      </span>
    </label>
  );
};

export default Textarea;
