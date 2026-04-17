"use client";

import React, { useState, useEffect } from "react";
import { Share2, Users, Gift, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ViralShare() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    // Show invite after 30 seconds to engage users
    const timer = setTimeout(() => setShowInvite(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const url = window.location.origin;
    const text = isRTL 
      ? "شوف أفضل موقع أفلام ومسلسلات مجاناً وبدون إعلانات مزعجة! 🚀" 
      : "Check out the best ad-free movie streaming site! 🚀";
    
    if (navigator.share) {
      navigator.share({ title: "VOZ Stream", text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    }
  };

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-44 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-2xl transition hover:scale-110 active:scale-95 lg:h-16 lg:w-16",
          isRTL ? "left-6" : "right-6"
        )}
      >
        <Users className="text-white" size={28} />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          +1
        </span>
      </button>

      <AnimatePresence>
        {(isOpen || showInvite) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed bottom-64 z-50 w-[90vw] max-w-sm rounded-3xl border border-white/10 bg-black/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)]",
              isRTL ? "left-6" : "right-6"
            )}
          >
            <button 
              onClick={() => {setIsOpen(false); setShowInvite(false);}} 
              className="absolute top-4 right-4 rounded-full bg-white/5 p-2 hover:bg-white/10"
            >
              <X size={16} className="text-white" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 text-green-500">
                <Gift size={32} />
              </div>
              <h3 className={cn("text-xl font-black text-white", isRTL && "font-arabic")}>
                {isRTL ? "شارك الموقع مع أصدقائك!" : "Invite your friends!"}
              </h3>
              <p className={cn("mt-2 text-sm text-muted", isRTL && "font-arabic")}>
                {isRTL 
                  ? "ساعدنا نكبر وشارك الموقع مع 5 من ربعك وبنعطيك مميزات الـ VIP مجاناً!" 
                  : "Help us grow! Share with 5 friends and get VIP features for free!"}
              </p>
              
              <button
                onClick={handleShare}
                className={cn(
                  "mt-6 w-full flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700",
                  isRTL && "font-arabic"
                )}
              >
                <Share2 size={18} />
                {isRTL ? "شارك عبر واتساب" : "Share via WhatsApp"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
