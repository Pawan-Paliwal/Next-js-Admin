"use client";
import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
    const colorBar = ["#e6b800", "#1a7abf", "#c0392b", "#27ae60", "#e67e22", "#8e44ad"];

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
                <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <motion.svg
                        width="80" height="80" viewBox="0 0 80 80"
                        style={{ position: "absolute" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    >
                        <circle cx="40" cy="40" r="36" fill="none" stroke="#1a7abf" strokeWidth="2"
                            strokeDasharray="60 160" strokeLinecap="round" />
                    </motion.svg>
                    <img src="/logo.svg" alt="CPG" width={48} height={48} style={{ position: "relative", zIndex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {["#1a7abf", "#e6b800", "#27ae60"].map((color, i) => (
                        <motion.div key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                            style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
                        />
                    ))}
                </div>
            </motion.div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", display: "flex" }}>
                {colorBar.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
        </div>
    );
};

export default Loading;