"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "../atoms/Button";
import { NAVIGATIONS } from "@/constants/navigation";
import { useModal } from "@/hooks/useModal";
import { LANGUAGES } from "@/constants/countries";
import PlayBtn from "../atoms/PlayBtn";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import usePathChange from "@/hooks/usePathChange";
import { useGetHeaderDataQuery, useGetSearchDataMutation } from "@/store/frontendSlice/homePageAPISlice";

const Header = () => {
  const [searchData, { data }] = useGetSearchDataMutation();
  console.log(data);
  const { data: headerData, isLoading } = useGetHeaderDataQuery();
  const productChildren = (headerData?.products ?? []).map((p) => ({
    label: p.ProductName,
    path: `/${p.ProductNameURL}`,
    description: "",
    image: "",
  }));

  const facilityChildren = (headerData?.facilityCategories ?? []).map((c) => ({
    label: c.CategoryName,
    path: `/${c.CategoryNameURL}`,
  }));

  const navs = NAVIGATIONS.map((item) => {
    if (item.label === "Products") {
      if (isLoading || productChildren.length === 0) return null;
      const { children: _, ...rest } = item;
      return { ...rest, children: productChildren };
    }
    if (item.label === "In House Infrastructure") {
      if (isLoading) return item;
      const staticChildren = [
        { label: "Quality Assurance", path: "/quality-assurance" },
        { label: "Foundry", path: "/foundry" },
        { label: "Tool Room", path: "/tool-room" },
      ];
      return {
        ...item,
        children: [...facilityChildren, ...staticChildren],
      };
    }
    return item;
  }).filter(Boolean);


  const { openModal } = useModal();
  const deskMenuRef = useRef(null);

  const [isDesktopMenu, setIsDesktopMenu] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(null);

  useClickOutside(deskMenuRef, () => {
    setIsDesktopMenu(false);
  });

  const handleMenu = () => {
    if (window.innerWidth <= 1024) {
      openModal("menu");
    } else {
      setIsDesktopMenu((prev) => !prev);
    }
  };

  usePathChange(() => {
    setIsDesktopMenu(false);
    setIsSubMenuOpen(null);
  });



  return (
    <header className="fixed top-0 right-0 left-0 z-5 flex items-center justify-between bg-white shadow-[0px_4px_4px_0px_#0000001A] xl:gap-[34px] 2xl:gap-12">
      <Link className="shrink-0 pl-[15px] outline-0 lg:pl-4 2xl:pl-10" href="/">
        <Image
          className="w-[130px] outline-0 lg:w-[150px] xl:w-[164px] 2xl:w-[200px]"
          src="/logo.svg"
          alt="Logo"
          width={164}
          height={67}
        />
      </Link>

      <div className="flex-1">
        <div className="border-text/50 hidden w-full items-center justify-between border-b py-[7px] pr-14 lg:pr-4 xl:flex 2xl:pr-10">
          <ul className="flex w-full items-center justify-end gap-6">
            <HeaderSearch />
            <li className="group relative flex items-center gap-1.5">
              <Image src="/icon/world.svg" alt="world" width={18} height={18} />
              <span className="text-sm">EN</span>
              <Image
                className=""
                src="/icon/down-gray.svg"
                alt="down"
                width={19}
                height={8}
              />

              <ul className="pointer-events-none absolute top-full left-0 z-10 w-[100px] translate-y-4 rounded-md bg-white opacity-0 shadow-lg transition-all duration-500 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                {LANGUAGES.map(({ name, country, code }, i) => (
                  <li
                    className="border-border/50 hover:bg-background flex cursor-pointer items-center gap-3 px-3 py-[5px] uppercase transition-all duration-300 ease-in-out not-last:border-b"
                    key={i}
                  >
                    <Image
                      src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
                      alt={name}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm">{code}</span>
                  </li>
                ))}
              </ul>
            </li>

            {["info@chanderpur.com", "1800-121-6209"].map((item, i) => (
              <li key={i}>
                <Link
                  className="text-sm"
                  href={i === 0 ? `mailto:${item}` : `tel:${item}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full items-center justify-end gap-3 pr-3.75 lg:pr-4 2xl:gap-8 2xl:pr-10">
          <ul className="hidden w-full items-center justify-end xl:flex">
            {navs.map(({ label, path, children }, i) => {
              const isActive = isSubMenuOpen === i;
              return (
                <li
                  onMouseEnter={() => {
                    if (isActive) return;
                    setIsSubMenuOpen(i);
                  }}
                  onMouseLeave={() => {
                    setIsSubMenuOpen(null);
                  }}
                  key={i}
                  className="relative before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0"
                >
                  <Link
                    className={` ${isActive ? "bg-primary text-white" : ""} flex h-full items-center gap-2 px-3 py-[17px] text-sm font-medium tracking-wider text-black uppercase transition-all duration-300 ease-in-out 2xl:px-[13px] 2xl:text-base`}
                    href={path}
                  >
                    {label}
                    {children && (
                      <Image
                        className={`transition-all duration-300 ease-in-out ${isActive ? " rotate-180 brightness-0 invert-100" : ""}`}
                        src="/icon/down.svg"
                        alt="down"
                        width={13}
                        height={7}
                      />
                    )}
                  </Link>
                  {children && (
                    <div
                      className={`${i === 2
                        ? "-left-14 min-w-[600px] grid-cols-3 gap-5 "
                        : i === 3
                          ? "min-w-[380px]"
                          : i === 4
                            ? "min-w-[254px]"
                            : i === 5
                              ? "min-w-[160px]"
                              : "left-0 min-w-[170px] grid-cols-[1fr]"
                        } border-primary scroll absolute top-full grid w-full origin-top rounded-b-lg border-t bg-white pt-2 pb-3 shadow-lg transition-all duration-500 ease-in-out ${isActive ? "transform-[perspective(2000px)_translate3d(0,0,0)_rotateX(0deg)_scale3d(1,1,1)]" : "transform-[perspective(2000px)_translate3d(0,0,50px)_rotateX(-90deg)_scale3d(0.86,0.75,1)]"}`}
                    >
                      {Array.from({ length: 3 }).map((_, colIndex) => {
                        const chunkSize = Math.ceil(children.length / 3);
                        return (
                          <ul key={colIndex}>
                            {children
                              .slice(
                                colIndex * chunkSize,
                                (colIndex + 1) * chunkSize,
                              )
                              .map(({ label, path, children = null }, i) => {
                                const globalIndex = colIndex * chunkSize + i;
                                return (
                                  <SubMenuLInk
                                    key={globalIndex}
                                    label={label}
                                    path={path}
                                    children={children}
                                    index={globalIndex}
                                  />
                                );
                              })}
                          </ul>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Button
            href="/contact-us"
            className="hidden! px-[18px]! py-[10px]! md:flex!"
          >
            Enquire Now{" "}
          </Button>
          <div className="flex items-center justify-center gap-3">
            <HeaderSearch className="block xl:hidden" />
            <div ref={deskMenuRef} className="relative">
              <ul
                onClick={handleMenu}
                className="flex cursor-pointer flex-col items-center justify-center gap-1.5 py-[18px]"
              >
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`bg-primary block h-[2px] w-[38px] origin-center transition-all duration-500 ease-in-out ${isDesktopMenu
                        ? i === 0
                          ? "translate-y-[6px] rotate-45"
                          : i === 1
                            ? "opacity-0"
                            : "-translate-y-[6px] -rotate-45"
                        : ""
                        }`}
                    ></span>
                  ))}
              </ul>

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute top-full right-0 h-[403px] w-[478px] rounded-bl-[50px] border-t border-[#E3E3E3] bg-[linear-gradient(270deg,#FFFFFF_16.83%,#EAF7FD_100%)] p-8 pt-12 transition-all duration-500 ease-in-out ${isDesktopMenu ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
              >
                <div className="mb-8 grid grid-cols-[219px_1fr] gap-8">
                  <figure className="after:bg-yellow relative before:absolute before:inset-0 before:z-3 before:bg-[linear-gradient(0deg,rgba(0,0,0,0.65)_0%,rgba(4,0,0,0)_100%)] after:absolute after:-top-3 after:-left-3 after:z-1 after:size-full">
                    <Image
                      className="relative z-2 h-full object-cover"
                      src="/image/home/field.svg"
                      alt="field"
                      width={219}
                      height={161}
                    />
                    <span className="absolute top-1/2 left-1/2 z-4 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                      <PlayBtn
                        onClick={() => openModal("video")}
                        className="mb-4 size-[38px]!"
                        variant="secondary"
                      />
                      <span className="text-center text-sm font-medium text-nowrap text-white">
                        Corporate Video
                      </span>
                    </span>
                  </figure>

                  <ul className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: "/icon/facebook-large.svg",
                        path: "https://www.facebook.com/chanderpurgroup",
                      },
                      {
                        icon: "/icon/linkedin-large.svg",
                        path: "https://www.linkedin.com/company/chanderpur-group",
                      },
                      {
                        icon: "/icon/instagram-large.svg",
                        path: "https://www.instagram.com/chanderpur_group/",
                      },
                      {
                        icon: "/icon/youtube-large.svg",
                        path: "https://www.youtube.com/@chanderpurgroup",
                      },
                      {
                        icon: "/icon/whatsapp-large.svg",
                        path: "https://www.whatsapp.com/channel/0029VaLuRESDp2Q5YBUFiA3H",
                      },
                      {
                        icon: "/icon/pinterest-large.svg",
                        path: "https://www.pinterest.com/chanderpur_group/",
                      },
                    ].map((item, i) => (
                      <li key={i} className="h-[55px]">
                        <Link
                          target="_blank"
                          className={`group flex items-center ${i === 0 ? "hover:border-[#1877F2] hover:bg-[linear-gradient(180deg,#1877F2_0%,#1877F2_100%)]" : i === 1 ? "hover:border-[#0A66C2] hover:bg-[linear-gradient(180deg,#0A66C2_0%,#0A66C2_100%)]" : i === 2 ? "hover:border-[#D62976] hover:bg-[linear-gradient(180deg,#D62976_0%,#D62976_100%)]" : i === 4 ? "hover:border-[#25D366] hover:bg-[linear-gradient(180deg,#25D366_0%,#25D366_100%)]" : "hover:border-[#FF0000] hover:bg-[linear-gradient(180deg,#FF0000_0%,#FF0000_100%)]"} flex-center border-primary size-full gap-2 border bg-[linear-gradient(180deg,#FFFFFF_0%,#DDF4FF_100%)]`}
                          href={item.path}
                        >
                          <Image
                            className="transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:invert-100"
                            src={item.icon}
                            alt={item.path}
                            width={24}
                            height={24}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Blogs",
                      path: "/blogs",
                      icon: "/icon/text-docs.svg",
                    },
                    {
                      label: "Careers",
                      path: "/career",
                      icon: "/icon/job-search.svg",
                    },
                    {
                      label: "Contact Us",
                      path: "/contact-us",
                      icon: "/icon/text-docs.svg",
                    },
                  ].map((item, i) => (
                    <li key={i} className="h-[111px] border border-[#0F8FC954]">
                      <Link
                        className="group flex size-full flex-col items-center justify-center gap-2 bg-[linear-gradient(180deg,#FFFFFF_0%,#DDF4FF_100%)] p-4 hover:bg-[linear-gradient(180deg,#0F8FC9_0%,#0F8FC9_100%)]"
                        href={item.path}
                      >
                        <Image
                          className="transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:invert-100"
                          src={item.icon}
                          alt={item.label}
                          width={32}
                          height={32}
                        />
                        <span className="text-primary font-medium transition-all duration-300 ease-in-out group-hover:text-white">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const SubMenuLInk = ({ className, label, path, children = null, index }) => {
  const [isNestedMenuOpen, setIsNestedMenuOpen] = useState(null);

  usePathChange(() => {
    setIsNestedMenuOpen(null);
  });

  const isNestedActive = isNestedMenuOpen === index;

  return (
    <li
      onMouseEnter={() => setIsNestedMenuOpen(index)}
      onMouseLeave={() => setIsNestedMenuOpen(null)}
      className="list-none"
    >
      <Link
        className={`group flex w-full items-center justify-between gap-3 px-5 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out hover:font-medium ${className} ${index % 4 === 0
          ? "hover:text-primary hover:[&>span]:bg-primary"
          : index % 4 === 1
            ? "hover:text-green-500 hover:[&>span]:border-green-500 hover:[&>span]:bg-green-500"
            : index % 4 === 2
              ? "hover:text-yellow-500 hover:[&>span]:border-yellow-500 hover:[&>span]:bg-yellow-500"
              : "hover:text-red hover:[&>span]:bg-red hover:[&>span]:border-red"
          }`}
        href={path}
      >
        <div className="flex items-start gap-3">
          <span className="border-primary mt-1.5 block size-[8px] shrink-0 border transition-all duration-300 ease-in-out"></span>{" "}
          {label}
        </div>
        {children && (
          <Image
            className={`transition-all duration-300 ease-in-out ${isNestedActive ? "-rotate-90 brightness-0" : ""}`}
            src="/icon/down.svg"
            alt="down"
            width={12}
            height={7}
          />
        )}
      </Link>
      {children && (
        <ul
          className={`border-primary absolute -top-[1px] left-full z-20 min-w-fit rounded-b-md border-t bg-white py-4  shadow  transition-all duration-300 ${isNestedActive ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0 "}`}
        >
          {children.map((item, i) => (
            <SubMenuLInk className="text-nowrap" key={i} {...item} index={i} />
          ))}
        </ul>
      )}
    </li>
  );
};


const HeaderSearch = ({ className }) => {
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(null);

  const [searchData, { isLoading }] = useGetSearchDataMutation();

  useClickOutside(searchRef, () => {
    setIsSearch(false);
    setSearchQuery("");
    setResults(null);
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setResults(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) return;

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await searchData({ keyword: value }).unwrap();
        setResults(result.combinedResults);
      } catch {
        setResults([]);
      }
    }, 500);
  };

  return (
    <li
      onClick={() => setIsSearch(true)}
      className={`cursor-pointer ${className}`}
    >
      <div
        ref={searchRef}
        className={`relative py-1 pl-4 transition-all duration-500 ease-in-out ${isSearch
          ? "border-text/50 w-[170px] rounded-full border md:w-[250px]"
          : "size-[34px]"
          }`}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          className={`text-sm outline-0 transition-all duration-500 ease-in-out ${isSearch ? "w-[82%]" : "w-0"
            }`}
          placeholder="Search"
        />
        <Image
          onClick={() => {
            setSearchQuery("");
            setResults(null);
          }}
          src={searchQuery ? "/icon/close.svg" : "/icon/search.svg"}
          alt="search"
          width={18}
          height={18}
          className={`absolute top-1/2 -translate-y-1/2 grayscale-100 transition-all duration-500 ease-in-out ${isSearch ? "right-4" : "right-[7px]"
            }`}
        />

        {/* Dropdown */}
        {isSearch && searchQuery && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[250px] rounded-md bg-white shadow-lg border border-gray-100 overflow-hidden">
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-gray-400">Searching...</p>
            ) : results === null ? null : results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No results found</p>
            ) : (
              <ul className="max-h-[300px] overflow-y-auto">
                {results.map((item, i) => (
                  <li key={i} className="border-b border-gray-50 last:border-0">
                    <Link
                      href={
                        item.Type === "product"
                          ? `/${item.ProductNameURL}`
                          : `/turnkey-projects/${item.TypeNameURL}`
                      }
                      onClick={() => {
                        setSearchQuery("");
                        setResults(null);
                        setIsSearch(false);
                      }}
                      className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.ProductName || item.TypeName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.Type === "product"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-green-50 text-green-500"
                        }`}>
                        {item.Type === "product" ? "Product" : "Project"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
};