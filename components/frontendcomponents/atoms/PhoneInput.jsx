"use client";

import { COUNTRIES } from "@/constants/countries";
import useClickOutside from "@/hooks/useClickOutside";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";



export default function PhoneInput({
  label = "Phone",
  required = false,
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  defaultCountryCode = "IN",
}) {
  const defaultCountry =
    COUNTRIES.find((c) => c.code === defaultCountryCode) ?? COUNTRIES[24];

  const [selected, setSelected] = useState(defaultCountry);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState(value ?? "");
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setOpen(false);
    setSearch("");
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
      setHighlightedIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [search]);

  useEffect(() => {
    const el = listRef.current?.children[highlightedIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  function selectCountry(country) {
    setSelected(country);
    setOpen(false);
    setSearch("");
    onChange?.(country.dial + phone, phone, country);
  }

  function handlePhoneChange(val) {
    const numeric = val.replace(/[^\d\s\-().+]/g, "");
    setPhone(numeric);
    onChange?.(selected.dial + numeric, numeric, selected);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedIndex]) selectCountry(filtered[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  }

  function generateFlag(flag, name) {
    return (
      <Image
        className="shrink-0 object-contain"
        src={`https://flagcdn.com/16x12/${flag}.png`}
        alt={name}
        width={16}
        height={12}
      />
    );
  }

  return (
    <div className="w-full">
      {label && (
        <label className="text-text block text-left font-normal">{label}</label>
      )}

      <div className={`border-border flex items-center border-b`}>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country: ${selected.name}`}
            className="flex cursor-pointer items-center gap-1.5 rounded-l-xl py-3"
          >
            {generateFlag(selected.code.toLowerCase(), selected.name)}
            <span className="text-text text-sm font-medium">
              {selected.dial}
            </span>

            <Image
              src="/icon/down-gray.svg"
              alt="down"
              width={16}
              height={16}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 z-50 mt-1.5 w-72 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                <Image
                  src="/icon/search.svg"
                  alt="search"
                  width={16}
                  height={16}
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search country or code…"
                  className="text-text placeholder:text-text flex-1 bg-transparent text-sm focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-text cursor-pointer text-xs font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <ul
                ref={listRef}
                className="scroll max-h-56 overflow-y-auto overscroll-contain py-1"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-center text-sm text-slate-400">
                    No countries found
                  </li>
                ) : (
                  filtered.map((country, idx) => {
                    const isActive = country.code === selected.code;
                    return (
                      <li
                        key={country.code}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => selectCountry(country)}
                        className={`flex cursor-pointer items-center gap-3 px-3.5 py-2 transition-colors duration-75 ${isActive ? "bg-slate-50" : "hover:bg-primary/5"
                          }`}
                      >
                        {generateFlag(country.code.toLowerCase(), country.name)}
                        <span
                          className={`flex-1 truncate text-sm ${isActive ? "text-primary" : "text-text"
                            }`}
                        >
                          {country.name}
                        </span>
                        <span
                          className={`shrink-0 text-xs font-medium tabular-nums ${isActive ? "text-primary" : "text-text"
                            }`}
                        >
                          {country.dial}
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          inputMode="tel"
          autoComplete="tel-national"
          className="text-text placeholder:text-text min-w-0 flex-1 rounded-r-xl bg-transparent px-3.5 py-3 text-sm focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
