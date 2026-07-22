"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function GlobalAlert() {
    const [isVisible, setIsVisible] = useState(false);
    const { isRTL } = useLanguage();

    useEffect(() => {
        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-xl"
                >
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-500 p-[2px] shadow-2xl shadow-emerald-500/20">
                        <div className="bg-black/90 backdrop-blur-3xl rounded-[1.95rem] p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                    <CheckCircle2 size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-xs font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                        {isRTL ? "تم تفعيل المحرك الجديد بنجاح" : "New Engine Activated Successfully"}
                                        <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                                    </h4>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
                                        {isRTL ? "يرجى تحديث الصفحة للاستمتاع بالمشاهدة" : "Please refresh to enjoy high-speed streaming"}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleRefresh}
                                    className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition active:scale-95 flex items-center gap-2"
                                >
                                    <RefreshCw size={12} className="animate-spin-slow" />
                                    {isRTL ? "تحديث" : "Refresh"}
                                </button>
                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="p-2 text-gray-600 hover:text-white transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
