"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGetMediaPageDataQuery } from "@/store/backendSlice/masterAPISlice";
import Button from "@/components/frontendcomponents/atoms/Button";
import Loader from "@/app/loading";

export default function GlobalSuccess() {
    const { data, isLoading } = useGetMediaPageDataQuery({ home: true });
    const allMedia = data || [];
    const sortedMedia = [...allMedia].sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    const topThreeMedia = sortedMedia.slice(0, 3);
    const remainingMedia = sortedMedia.slice(3, 8);
    const [activeSuccess, setActiveSuccess] = useState("");
    useEffect(() => {
        if (remainingMedia.length > 0 && !activeSuccess) {
            setActiveSuccess(remainingMedia[0].MediaID.toString());
        }
    }, [remainingMedia, activeSuccess]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return <Loader />;
    }


    if (allMedia.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="home-secE sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h2>Making headlines, <span>Creating impact</span></h2>
                    </div>
                    <div className="top_sucess">
                        {topThreeMedia.map((media) => (
                            <Link className="success_col" target="_blank" key={media.MediaID} href={media.ThirdPartyLink || "#"}>
                                <figure>
                                    <Image
                                        src={`/OnlineImages/MediaImages/${media.MediaImage}`}
                                        width="120"
                                        height="110"
                                        alt={media.Title}
                                    />
                                </figure>
                                <figcaption>
                                    <p>{media.Title}</p>
                                    <span className="date">{formatDate(media.MediaDate)}</span>
                                </figcaption>
                            </Link>
                        ))}
                    </div>
                    {remainingMedia.length > 0 && (
                        <div className="success_wrapper">
                            <div className="flex main_wrap">
                                <div className="success_media tab-nav-content">
                                    {remainingMedia.map((media) => (
                                        <div
                                            key={media.MediaID}
                                            className={`tabs ${activeSuccess === media.MediaID.toString() ? "active" : ""}`}
                                        >
                                            <div className="banner success_banner">
                                                <div className="bg">
                                                    <Image
                                                        src={`/OnlineImages/MediaImages/${media.MediaImage}`}
                                                        width="780"
                                                        height="609"
                                                        alt={media.Title}
                                                    />
                                                    <div className="banner-wrapper">
                                                        <h4>{media.Title}</h4>
                                                        <Button classname="white" linkHref={media.ThirdPartyLink || "#"} target="_blank" rel="noopener noreferrer" buttonText="Read More" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="success_info tab-nav">
                                    {remainingMedia.map((media, index) => (
                                        <div
                                            key={media.MediaID}
                                            className={`info_col ${activeSuccess === media.MediaID.toString() ? "active" : ""}`}
                                            onClick={() => setActiveSuccess(media.MediaID.toString())}
                                        >
                                            <div className="count">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="desc">
                                                <p>{media.Title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="btn_wrap">
                                <Button classname="top-right" linkHref="/media" buttonText="Explore all voices" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}