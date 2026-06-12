"use client";
import { useEffect, useState } from "react";
import Loader from "../components/frontendcomponents/molecules/Loader";

export default function LoaderPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);


    if (!loading) return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ccfbf1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <p style={{ color: "#4b5563", fontSize: "18px" }}>Content loaded!</p>
        </div>
    );

    return (
        <Loader />
    );
}