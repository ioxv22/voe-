"use client";

import React, { useState, useEffect } from "react";
import { Share2, Users, Gift, X, Send, Ghost, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function ViralShare() {
  const { t, isRTL } = useLanguage();
  const { requestVIP, isPremium } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    // Show invite after 30 seconds to engage users - only if NOT premium
    if (isPremium) {
      setShowInvite(false);
      return;
    }
    const timer = setTimeout(() => setShowInvite(true), 30000);
    return () => clearTimeout(timer);
  }, [isPremium]);

  const handleShare = async () => {
    const url = window.location.origin;
    const text = isRTL 
      ? "شوف أفضل موقع أفلام ومسلسلات مجاناً وبدون إعلانات مزعجة! 🚀" 
      : "Check out the best ad-free movie streaming site! 🚀";
    
    // Send request instead of instant activation
    await requestVIP();
    
    // Notify user
    alert(isRTL ? "تم إرسال طلب الـ VIP! سيقوم المدير بالمراجعة والتفعيل قريباً." : "VIP Request Sent! Admin will verify and activate soon.");
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "VOZ Stream", text, url });
      } catch (e) {
        console.log("Share cancelled or failed");
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    }
    
    // Force refresh after a small delay to show the "Pending" state or notify user
    setTimeout(() => {
        setIsOpen(false);
        setShowInvite(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Share Button */}
      <button
        id="viral-share-btn"
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
              
              <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                {/* WhatsApp */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-4 text-[10px] font-black uppercase text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
                >
                  <Share2 size={16} /> WhatsApp
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    requestVIP();
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(isRTL ? "أفضل موقع أفلام ومسلسلات مجاناً! 🚀" : "Best free movie site! 🚀")}`, "_blank");
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#0088cc] py-4 text-[10px] font-black uppercase text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <Send size={16} /> Telegram
                </button>

                {/* Snapchat */}
                <button
                  onClick={() => {
                    requestVIP();
                    if (navigator.share) {
                        navigator.share({ title: "VOZ Stream", url: window.location.origin });
                    } else {
                        alert(isRTL ? "انسخ الرابط وشاركه في سناب!" : "Copy link and share on Snap!");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFFC00] py-4 text-[10px] font-black uppercase text-black transition hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20"
                >
                  <Ghost size={16} /> Snapchat
                </button>

                {/* Instagram / TikTok */}
                <button
                  onClick={() => {
                    requestVIP();
                    if (navigator.share) {
                        navigator.share({ title: "VOZ Stream", url: window.location.origin });
                    } else {
                        navigator.clipboard.writeText(window.location.origin);
                        alert(isRTL ? "تم نسخ الرابط! شاركه في إنستا أو تيك توك" : "Link copied! Share on Insta or TikTok");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] py-4 text-[10px] font-black uppercase text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  <Instagram size={16} /> Insta/TikTok
                </button>
              </div>
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
