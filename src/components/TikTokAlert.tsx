"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TikTokAlert() {
    const [isVisible, setIsVisible] = useState(false);
    const { isRTL } = useLanguage();

    useEffect(() => {
        // Show after a delay, but check if user has already dismissed it in this session
        const dismissed = sessionStorage.getItem("voz_tiktok_dismissed");
        if (!dismissed) {
            const timer = setTimeout(() => setIsVisible(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("voz_tiktok_dismissed", "true");
    };

    const handleFollow = () => {
        window.open("https://www.tiktok.com/@h7maddd", "_blank");
        handleClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ x: isRTL ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isRTL ? -100 : 100, opacity: 0 }}
                    className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-[999] w-full max-w-[280px]`}
                >
                    <div className="relative group overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl shadow-primary/20">
                        {/* TikTok Style Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ea]/10 via-black to-[#ff0050]/10 opacity-50" />
                        
                        <div className="relative p-5 space-y-4">
                            <button 
                                onClick={handleClose}
                                className="absolute top-3 right-3 text-gray-500 hover:text-white transition p-1"
                            >
                                <X size={14} />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00f2ea] via-white to-[#ff0050] p-[2px] shadow-lg shadow-[#ff0050]/20">
                                    <div className="h-full w-full rounded-[14px] bg-black flex items-center justify-center overflow-hidden">
                                        <img 
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=h7maddd" 
                                            alt="h7maddd"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">@h7maddd</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">
                                        {isRTL ? "تابعني على تيك توك" : "Follow on TikTok"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-[11px] text-gray-300 font-medium leading-relaxed italic">
                                {isRTL 
                                    ? "دعمكم هو سر استمرارنا! تابعني لمتابعة آخر تحديثات VOZ." 
                                    : "Support us by following! Get the latest VOZ updates first."}
                            </p>

                            <button 
                                onClick={handleFollow}
                                className="w-full bg-white text-black py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#00f2ea] transition active:scale-95 shadow-xl"
                            >
                                <Heart size={14} fill="black" />
                                {isRTL ? "متابعة الآن" : "Follow Now"}
                                <ExternalLink size={12} className="opacity-50" />
                            </button>
                        </div>

                        {/* TikTok "Pulse" Animation */}
                        <div className="absolute -bottom-1 -left-1 h-2 w-2 bg-[#00f2ea] rounded-full blur-md animate-pulse" />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#ff0050] rounded-full blur-md animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
