"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface AdBannerProps {
    slot?: string;
    format?: "horizontal" | "vertical" | "square";
}

export default function AdBanner({ slot = "default", format = "horizontal" }: AdBannerProps) {
    const { isPremium } = useAuth();

    // Hide ads for premium users
    if (isPremium) return null;

    const dimensions = {
        horizontal: "w-full max-w-[728px] h-[90px]",
        vertical: "w-[160px] h-[600px]",
        square: "w-[300px] h-[250px]",
    };

    return (
        <div className={`flex flex-col items-center justify-center my-6 gap-2`}>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">Sponsored Content</span>
            <div 
                className={`${dimensions[format]} bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center relative group backdrop-blur-sm`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="z-10 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">VOZ AD SLOT</p>
                    <p className="text-[8px] text-gray-700 uppercase">Premium Placement</p>
                </div>

                {/* 
                <iframe 
                    src={`https://ad.a-ads.com/YOUR_ID?size=${format === 'horizontal' ? '728x90' : '300x250'}`} 
                    style={{ border: 'none', width: '100%', height: '100%', overflow: 'hidden' }}
                /> 
                */}
            </div>
        </div>
    );
}
