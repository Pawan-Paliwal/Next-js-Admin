"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MoreTrends({ mediaData = [] }) {
    const [displayCount, setDisplayCount] = useState(9);
    const [isLoading, setIsLoading] = useState(false);
    const visibleMedia = mediaData.slice(0, displayCount);
    const hasMore = displayCount < mediaData.length;
    
    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + 9);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <section>
            <div className="more_trends_sec sec-pad-all">
                <div className="container">
                    <div className="more_trends">
                        {visibleMedia.map((media, index) => (
                            <Link
                                key={media.MediaID}
                                className="more_trends_col"
                                href={media.ThirdPartyLink || ""}
                                target={media.ThirdPartyLink ? "_blank" : "_self"}
                                style={{
                                    animation: index >= displayCount - 9 ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                                    opacity: index >= displayCount - 9 ? 0 : 1,
                                }}
                            >
                                <figure>
                                    <Image
                                        src={media.MediaImage ? `/OnlineImages/MediaImages/${media.MediaImage}` : "/assets/images/media/more_trends1.jpg"}
                                        width="500"
                                        height="300"
                                        alt="More Images"
                                    />
                                </figure>
                                <figcaption>
                                    <h6>{media.Title}</h6>
                                    <p className="date">
                                        {media.MediaDate
                                            ? new Date(media.MediaDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })
                                            : ""}
                                    </p>
                                </figcaption>
                            </Link>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="btn_wrap">
                            <Image src="/assets/images/media/load_more.svg" width="80" height="70" alt="Load More" />
                            <button 
                                type="button" 
                                className="load_btn" 
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                style={{
                                    opacity: isLoading ? 0.6 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    )
}