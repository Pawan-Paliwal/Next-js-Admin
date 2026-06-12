'use client'
import React from "react";
import Select from "react-select";
import { useEffect, useState } from 'react'

const customStyles = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    height: "100%",
    backgroundColor: "#FBFBFB",
    color: "#818181",
    border: "none",
    padding: "0 10px",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: state.isFocused ? "none" : "none",
  }),
  label: (base, state) => ({
    ...base,
    display: "none"
  }),
  valueContainer: (base, state) => ({
    ...base,
    height: "100%",
    color: state.isFocused ? "#000" : "#000",
    padding: 0,
  }),
  input: (base, state) => ({
    ...base,
    width: "100%",
    height: "41px",
    color: "#000",
    padding: 0,
    minHeight: "100%",
    minWidth: "100%"
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#818181",
    fontSize: "16px"
  }),
  option: (base, state) => ({
    ...base,
    width: "100%",
    minWidth: "fit-content",
    background: state.isFocused ? "#fff" : "#fff",
    lineHeight: "18px",
    marginBottom: "5px",
    fontSize: "14px",
    padding: "6px 10px",
    color: state.isFocused ? "#666" : "#666",
    "&:hover": {
      background: "#000",
      color: "#fff"
    },
    transition: ".3s ease"
  }),
  singleValue: (base, state) => ({
    ...base,
    color: "#000",
    fontSize: "16px",
    overflow: "visible"
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10,
    minWidth: "max-content"
  })
}

export default function MySelect({
  id,
  placeholder,
  options,
  selectedValue,
  classname = "",
  onValueChange,
  styles: overrideStyles,
  components: overrideComponents
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const mergedStyles = {};
  Object.keys(customStyles).forEach(key => {
    mergedStyles[key] = (base, state) => {
      const custom = customStyles[key]?.(base, state) || base;
      const override =
        overrideStyles?.[key]?.(custom, state) || {};
      return { ...custom, ...override };
    };
  });
  const selectedOption = options.find(opt => opt.value === selectedValue?.value || opt.value === selectedValue) || null;
  if (!isClient) return null
  return (
    <Select
      className={classname}
      inputId={id}
      placeholder={placeholder}
      options={options}
      value={selectedOption}
      onChange={onValueChange}
      styles={mergedStyles}
      components={{
        IndicatorSeparator: () => null,
        ...(overrideComponents || {})
      }}
    />
  );
}
