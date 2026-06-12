

"use client";
import Image from "next/image";
import Link from "next/link";
import Overlay from "./Overlay";
import ThanksPop from "../molecules/ThanksPop";
import SigninPop from "../organisms/SigninPop";
import { useGetFooterDataQuery } from "@/store/backendSlice/homeAPISlice";
import Loader from "@/app/loading";
import FooterStrip from "./FooterStrip";

export default function Footer() {
    const { data, isLoading } = useGetFooterDataQuery();
    const footerProductsData = data?.footerProducts || [];
    const footerStatic = data?.footerStatic || {};
    if (isLoading) return <Loader />;

    return (
        <>
            <footer className="sec-pad">
                <div className="container-fluid">
                    <div className="footer_wrapper">
                        <div className="upper-footer">
                            <div className="colA">
                                <Link href="/" className="logo">
                                    <Image
                                        src="/assets/logo-light.svg"
                                        width={230}
                                        height={55}
                                        alt="Logo"
                                    />
                                </Link>

                                <div className="list">
                                    <h6>Social Media</h6>
                                    <ul className="social_icons">
                                        {footerStatic?.Twitter && (
                                            <li>
                                                <a href={footerStatic.Twitter} target="_blank" rel="noreferrer">
                                                    {/* X */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                                                        <path fill="currentColor" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}

                                        {footerStatic?.Facebook && (
                                            <li>
                                                <a href={footerStatic.Facebook} target="_blank" rel="noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">
                                                        <path fill="currentColor" d="M240 363.3V576h116V363.3h86.5l18-97.8H356v-34.6c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4v42.1h-66v97.8z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}

                                        {footerStatic?.Instagram && (
                                            <li>
                                                <a href={footerStatic.Instagram} target="_blank" rel="noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                        )}

                                        {footerStatic?.LinkedIn && (
                                            <li>
                                                <a href={footerStatic.LinkedIn} target="_blank" rel="noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="colB">
                                <div className="list">
                                    <h6>Quick Links</h6>
                                    <ul>
                                        <li><Link href="/">Home</Link></li>
                                        <li><Link href="/about-us">About us</Link></li>
                                        <li><Link href="/partners">Partners</Link></li>
                                        <li><Link href="/media">Media room</Link></li>
                                        <li><Link href="/careers">Careers</Link></li>
                                    </ul>
                                </div>
                                {footerProductsData.length > 0 && (
                                    <div className="list">
                                        <h6>Solutions</h6>
                                        <ul>
                                            {footerProductsData.map(group => (
                                                <li key={group.name}>
                                                    <Link href={group.displayUrl || `/${group.url}`}>
                                                        {group.displayName}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="list">
                                    <h6>Contact Us</h6>
                                    <ul>
                                        {footerStatic?.Email && (
                                            <li>
                                                <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"></path>
                                                </svg></div>
                                                <Link href={`mailto:${footerStatic.Email}`}>
                                                    {footerStatic.Email}
                                                </Link>
                                            </li>
                                        )}

                                        {footerStatic?.PhoneNumber && (
                                            <li>
                                                <div className="icon"> <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2 2 0 0 0 .006.134q.008.124.035.33c.039.27.114.642.26 1.08c.294.88.87 2.019 1.992 3.141s2.261 1.698 3.14 1.992c.439.146.81.22 1.082.26a4 4 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34l4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874S3.527 6.11 3.833 4m5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617c-.34 2.242-.801 8.864 4.425 14.09s11.848 4.764 14.09 4.425c.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a5 5 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508s-1.302-1.739-1.508-2.36a5 5 0 0 1-.125-.447z"></path>
                                                </svg></div>
                                                <Link href={`tel:${footerStatic.PhoneNumber}`}>
                                                    {footerStatic.PhoneNumber}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="lower-footer">
                            <p>© Copyright Usekiwi Infolabs Pvt. Ltd.</p>
                            <div className="links">
                                <Link href="/terms-of-use">Terms of Use</Link>
                                <Link href="/privacy-policy">Privacy Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <Overlay />
            <FooterStrip />
            <ThanksPop />
            <SigninPop />
        </>
    );
}
