"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TrendsSec from "./TrendsSec";
import MoreTrends from "./MoreTrends";
import { useGetMediaPageDataQuery } from "@/store/backendSlice/masterAPISlice";
import "@/uploads/styles/media/media.css";

export default function MediaPage() {
    const router = useRouter();
    const { data, isLoading } = useGetMediaPageDataQuery();
    const allMedia = data || [];

    const topFourMedia = allMedia.slice(0, 2);
    const remainingMedia = allMedia.slice(2);

  
    if (isLoading) return null;
   if (allMedia.length === 0) {
        return (
            <main style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '90vh',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '600px',
                    width: '100%'
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="120"
                        height="120"
                        viewBox="0 0 16 16"
                        style={{
                            marginBottom: '1.5rem',
                            opacity: 0.4,
                            color: '#666'
                        }}
                    >
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"
                            clipRule="evenodd"
                        />
                    </svg>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#333'
                    }}>
                        No Media Content Available
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>
                        We're currently working on adding new media content. Please check back soon for updates.
                    </p>
                    <a
                        href="/"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            backgroundColor: '#0066cc',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        Go to Homepage
                    </a>
                </div>
            </main>
        );
    }
    return (
        <main>
            {topFourMedia.length > 0 && <TrendsSec mediaData={topFourMedia} />}
            {remainingMedia.length > 0 && <MoreTrends mediaData={remainingMedia} />}
        </main>
    );
}
