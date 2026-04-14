"use client";

import Script from "next/script";
import { useAuth } from "@/context/AuthContext";

export default function GlobalAds() {
    const { isPremium } = useAuth();

    // If user is Premium, do not load the global ad scripts
    if (isPremium) return null;

    return (
        <>
            {/* Monetag MultiTag */}
            <Script 
                src="https://quge5.com/88/tag.min.js" 
                data-zone="229810" 
                strategy="afterInteractive"
                data-cfasync="false"
                async
            />
        </>
    );
}
