"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useModalStore } from "@/store/modalStore";
import ServiceCol from "../molecules/ServiceCol";
import Button from "../atoms/Button";
import { useGetProductHeaderSectionDataQuery } from "@/store/backendSlice/homeAPISlice";
import { isUserLoggedIn, clearAuthCookies, getCookie } from "@/utils/cookieService";
import toast from "react-hot-toast";
import "@/uploads/styles/header/header.css";

const LANGUAGES = [
    { label: "English", code: "en" },
    { label: "Hindi", code: "hi" },
    { label: "Kannada", code: "kn" },
    { label: "Tamil", code: "ta" },
    { label: "Telugu", code: "te" },
    { label: "Bengali", code: "bn" },
    { label: "Marathi", code: "mr" }
];

export default function Header() {
    const [headerFixed, setHeaderFixed] = useState(false);
    const [openLang, setOpenLang] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [solutionsOpen, setSolutionsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const accountDropdownRef = useRef(null);
    const langDropdownRef = useRef(null);
    const isHamOpen = useModalStore((state) => state.isHamOpen)
    const openHam = useModalStore((state) => state.openHam);
    const openSignin = useModalStore((state) => state.openSignin)
    const closeHam = useModalStore((state) => state.closeHam)
    const { data, isLoading } = useGetProductHeaderSectionDataQuery();
    const categoriesWithProducts = Array.isArray(data) ? data : (data?.data || []);
    const validCategories = categoriesWithProducts.filter((category) => category?.products && category.products.length > 0);

    // Check login status on component mount and page load
    useEffect(() => {
        setIsLoggedIn(isUserLoggedIn());
    }, []);

    useEffect(() => {
        const handleBodyClick = (e) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
                setOpenLang(false);
            }
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
                setAccountDropdownOpen(false);
            }
        };
        document.body.addEventListener("click", handleBodyClick);
        const handleScroll = () => {
            setHeaderFixed(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 991);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("click", handleBodyClick);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const solutionsLi = document.querySelectorAll(".solutions_li");
        const megaDropdown = document.querySelector(".hasDropdown");
        if (!megaDropdown) return;
        const megaDropdownEnter = () => {
            megaDropdown.classList.add("active");
        };

        const megaDropdownLeave = () => {
            megaDropdown.classList.remove("active");
        };

        megaDropdown.addEventListener("mouseenter", megaDropdownEnter);
        megaDropdown.addEventListener("mouseleave", megaDropdownLeave);

        const handleMouseEnter = (e) => {
            solutionsLi.forEach((li) => li.classList.remove("active"));
            e.currentTarget.classList.add("active");
        };
        solutionsLi.forEach((li) => {
            li.addEventListener("mouseenter", handleMouseEnter);
        });
        return () => {
            solutionsLi.forEach((li) => {
                li.removeEventListener("mouseenter", handleMouseEnter);
            });
            megaDropdown.removeEventListener("mouseenter", megaDropdownEnter);
            megaDropdown.removeEventListener("mouseleave", megaDropdownLeave);
        };
    }, [validCategories]);


    const changeLanguage = (langCode) => {
        const select = document.querySelector(".goog-te-combo");
        if (!select) return;

        select.value = langCode;
        select.dispatchEvent(new Event("change"));
    };

    // Solutions accordion
    const solutionAccOpen = () => {
        if (!isMobile) return;
        setSolutionsOpen(prev => !prev);
    }

    const handleMobileLinkClick = () => {
        if (isMobile) {
            closeHam();
        } else {
            const megaDropdown = document.querySelector(".hasDropdown");
            megaDropdown?.classList.remove("active");
        }
    };

    // Dashboard redirect handler - reads ActiveRole cookie
    const goToDashboard = () => {
        const role = getCookie('ActiveRole');
        if (role === 'MARKETING' || role === 'BD' || role === 'INSTITUTION') {
            window.open(process.env.NEXT_PUBLIC_NEW_WEBAPP_REDIRECTION_URL, '_self');
        } else {
            window.open(process.env.NEXT_PUBLIC_WEBAPP_REDIRECTION_URL, '_self');
        }
    };

    // Sign out handler - clears all auth cookies and updates state
    const handleSignOut = () => {
        clearAuthCookies();
        setIsLoggedIn(false);
        setAccountDropdownOpen(false);
        toast.success("Signed out successfully");
        // User stays on the same page - no redirect
    };

    return (
        <header className={`${headerFixed ? "header-fixed" : ""} ${isHamOpen ? "ham-open" : ""}`}>
            <div className="container-fluid">
                <div className="header-container">
                    <div className="colA">
                        <Link href="/" className="logo">
                            <Image
                                src="/assets/logo.svg"
                                width={300}
                                height={55}
                                alt="Logo"
                            ></Image>
                        </Link>
                    </div>
                    <div className={`colB ${isMobile ? "model" : ""} ${isHamOpen ? "is-open" : ""}`}>
                        <button className="close" onClick={closeHam}>
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <ul className="nav-items">
                            <li onClick={handleMobileLinkClick}>
                                <Link href="/about-us">About Us</Link>
                            </li>
                            {!isLoading && validCategories.length > 0 && (
                                <li className={`hasDropdown ${solutionsOpen ? "is_open" : ""}`}>
                                    <div className="btnnav" onClick={solutionAccOpen}>
                                        <button type="button" className="link">Solutions</button>
                                        <div className="icon"></div>
                                    </div>
                                    {/* <div className={`dropdown-menu ${isMobile ? "model" : ""} ${isHamOpen ? "is-open" : ""}`}> */}
                                    <div className="dropdown-menu">
                                        <div className="dropdown-menu-wrap">
                                            <div className="colA-md">
                                                <ul className="solutions_ul">
                                                    {validCategories.map((category, index) => (
                                                        <li
                                                            key={category.categoryId || index}
                                                            className={`solutions_li ${index === 0 ? "active" : ""}`}
                                                        >
                                                            <div className="solution_cat">
                                                                <div className="cat_ico">
                                                                    <Image
                                                                        src={`/OnlineImages/CategoryImages/${category.categoryImage}`}
                                                                        width={36}
                                                                        height={48}
                                                                        alt={category.categoryName || "Category icon"}
                                                                    />
                                                                </div>
                                                                <p>{category.categoryName}</p>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18px"
                                                                    height="18px"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M4 12h12.25L11 6.75l.66-.75l6.5 6.5l-6.5 6.5l-.66-.75L16.25 13H4z"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                            <div className="solution_submenu">
                                                                <div className="submenu_wrapper">
                                                                    <div className="heading">
                                                                        <h2>{category.categoryName}</h2>
                                                                        <p>{category.categoryDescription}</p>
                                                                    </div>
                                                                    <div className="submenu_grid">
                                                                        {category.products.map((product, pIndex) => (
                                                                            <ServiceCol
                                                                                key={product.productId || pIndex}
                                                                                classname="no_anchor"
                                                                                linkHref={`/${product.productNameURL}`}
                                                                                mediaType={
                                                                                    product.productImage?.endsWith(".mp4")
                                                                                        ? "video"
                                                                                        : "image"
                                                                                }
                                                                                mediaSrc={`/OnlineImages/ProductImages/${product.productImage}`}
                                                                                //  title={(() => {
                                                                                //     const name = product.productName || "";
                                                                                //     if (name.startsWith("Procalyx")) return "Procalyx";
                                                                                //     if (name.trim().toLowerCase() === "swasth for families") return "Swasth";
                                                                                //     if (name.trim().toLowerCase() === "swasth for hospitals") return "Swasth";
                                                                                //     if (name.trim().toLowerCase() === "swasth for corporates") return "Swasth Corporate";
                                                                                //     if (name.trim().toLowerCase() === "Swasthera for Families & Individuals") return "Swasthera";
                                                                                //     if (name.trim().toLowerCase() === "Swasthera for Wellness Brands") return "Swasthera";
                                                                                //     return name;
                                                                                // })()}
                                                                                title={product.ProductHeaderListName || product.productName || ""}
                                                                                onClick={handleMobileLinkClick}
                                                                            // desc={product.productDescription}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                            <li onClick={handleMobileLinkClick}>
                                <Link href="/partners">Partners</Link>
                            </li>
                            <li onClick={handleMobileLinkClick}>
                                <Link href="/media">Media room</Link>
                            </li>
                            <li onClick={handleMobileLinkClick}>
                                <Link href="/contact-us">Contact us</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="colC">
                        <div ref={langDropdownRef} className={`lang_select ${openLang ? "open" : ""}`}>
                            <div
                                className="selected_lang"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenLang(!openLang);
                                }}
                            >
                                <div className="icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 28 28"
                                    >
                                        <path
                                            fill="#000"
                                            d="M14 3.5c.985 0 2.11.885 3.033 2.862c.416.892.762 1.953 1.014 3.138H9.953c.252-1.185.598-2.246 1.014-3.138C11.89 4.385 13.015 3.5 14 3.5M9.608 5.728C9.102 6.812 8.698 8.09 8.422 9.5H4.51a10.53 10.53 0 0 1 6.062-5.428a10 10 0 0 0-.964 1.656M8.183 11c-.12.96-.183 1.966-.183 3s.063 2.04.183 3H3.935a10.5 10.5 0 0 1-.435-3c0-1.043.152-2.05.435-3zm.239 7.5c.276 1.41.68 2.688 1.186 3.772c.28.599.601 1.16.964 1.656A10.53 10.53 0 0 1 4.51 18.5zm1.53 0h8.095c-.252 1.185-.598 2.246-1.014 3.138C16.11 23.615 14.985 24.5 14 24.5s-2.11-.885-3.033-2.862c-.416-.892-.762-1.953-1.014-3.138m8.353-1.5h-8.61a23 23 0 0 1-.195-3c0-1.045.069-2.051.195-3h8.61c.127.949.195 1.955.195 3s-.069 2.051-.195 3m1.273 1.5h3.912a10.53 10.53 0 0 1-6.062 5.428a10 10 0 0 0 .964-1.656c.506-1.084.91-2.363 1.186-3.772m4.487-1.5h-4.248c.12-.96.183-1.966.183-3s-.063-2.04-.183-3h4.248c.283.95.435 1.957.435 3s-.152 2.05-.435 3M17.428 4.072A10.53 10.53 0 0 1 23.49 9.5h-3.912c-.276-1.41-.68-2.688-1.186-3.772a10 10 0 0 0-.964-1.656M14 26c6.627 0 12-5.373 12-12S20.627 2 14 2S2 7.373 2 14s5.373 12 12 12"
                                            strokeWidth={0.1}
                                            stroke="#fff"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="show_lan">EN</div>
                                <div className="icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#000"
                                            d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
                                            strokeWidth={0.1}
                                            stroke="#fff"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="dropdown_list">
                                {LANGUAGES.map((lang) => (
                                    <li
                                        key={lang.code}
                                        onClick={() => {
                                            changeLanguage(lang.code);
                                            setOpenLang(false);
                                            if (lang.code === "en") {
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        {lang.label}
                                    </li>
                                ))}
                            </div>
                        </div>
                        {isLoggedIn ? (
                            <div ref={accountDropdownRef} className={`account_dropdown ${accountDropdownOpen ? "open" : ""}`}>
                                <div
                                    className="account_btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAccountDropdownOpen(!accountDropdownOpen);
                                    }}
                                >
                                    My Account
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="dropdown_menu">
                                    <button type="button" onClick={goToDashboard}>
                                        Dashboard
                                    </button>
                                    <button type="button" onClick={handleSignOut}>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button buttonText="Sign in" onClick={openSignin} />
                        )}
                        <button type="button" className="ham-btn" onClick={openHam}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
