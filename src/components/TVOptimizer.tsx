"use client";

import { useEffect } from "react";

export default function TVOptimizer() {
    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        
        // Comprehensive TV detection
        const isTV = 
            ua.includes("smart-tv") || 
            ua.includes("smarttv") || 
            ua.includes("tizen") || 
            ua.includes("webos") || 
            ua.includes("apple-tv") || 
            ua.includes("appletv") || 
            ua.includes("googletv") || 
            ua.includes("android tv") || 
            ua.includes("firetv") || 
            ua.includes("crkey") || 
            ua.includes("roku") ||
            ua.includes("dlna") ||
            ua.includes("viera");

        if (isTV) {
            console.log("📺 TV Optimized Mode Active");
            document.body.classList.add("tv-mode");
            
            // Disable some browser features that lag on TV
            // @ts-ignore
            if (window.requestIdleCallback) {
                // @ts-ignore
                window.requestIdleCallback(() => {
                    document.body.style.textShadow = "none";
                });
            }
        }
    }, []);

    return null; // Side-effect only component
}
