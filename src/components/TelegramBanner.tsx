"use client";

import React, { useState, useEffect } from "react";
import { Send, X, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function TelegramBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const { isRTL } = useLanguage();

    useEffect(() => {
        const closed = localStorage.getItem("voz_tg_banner_closed");
        if (!closed) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const closeBanner = () => {
        setIsVisible(false);
        localStorage.setItem("voz_tg_banner_closed", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-2xl px-4"
                >
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#229ED9] to-[#0088cc] p-[2px] shadow-2xl shadow-[#229ED9]/20">
                        <div className="bg-black/90 backdrop-blur-3xl rounded-[1.95rem] p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#229ED9] flex items-center justify-center shadow-lg shadow-[#229ED9]/40 animate-pulse">
                                    <Send size={24} className="text-white -ml-1 mt-1" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                        {isRTL ? "انضم لقناة التحديثات" : "Join Update Channel"}
                                        <BellRing size={12} className="text-yellow-400 animate-bounce" />
                                    </h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
                                        {isRTL ? "تابع أحدث الأفلام والمسلسلات فور صدورها" : "Get notified for new movies & series instantly"}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <a 
                                    href="https://t.me/VOZSTREAM" 
                                    target="_blank"
                                    onClick={closeBanner}
                                    className="bg-[#229ED9] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0088cc] shadow-xl shadow-[#229ED9]/20 transition active:scale-95"
                                >
                                    {isRTL ? "دخول" : "Join Now"}
                                </a>
                                <button 
                                    onClick={closeBanner}
                                    className="p-2 text-gray-600 hover:text-white transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
