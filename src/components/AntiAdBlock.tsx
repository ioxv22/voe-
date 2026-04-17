"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Unlock, Heart, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AntiAdBlock() {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const { isPremium } = useAuth();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (isPremium) return;

    const checkAdBlock = async () => {
      // Method 1: Check if a fake ad element is hidden
      const fakeAd = document.createElement('div');
      fakeAd.innerHTML = '&nbsp;';
      fakeAd.className = 'adsbox ad-unit google-ads';
      fakeAd.style.position = 'absolute';
      fakeAd.style.left = '-9999px';
      fakeAd.style.top = '-9999px';
      document.body.appendChild(fakeAd);
      
      const isBlocked = window.getComputedStyle(fakeAd).display === 'none' || fakeAd.offsetHeight === 0;
      
      // Method 2: Attempt to fetch a common ad script URL
      let isScriptBlocked = false;
      try {
        const res = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { mode: 'no-cors' });
      } catch (e) {
        isScriptBlocked = true;
      }

      if (isBlocked || isScriptBlocked) {
        setIsAdBlockActive(true);
      }
      
      document.body.removeChild(fakeAd);
    };

    // Check after a small delay to let adblockers kick in
    const timer = setTimeout(checkAdBlock, 3000);
    return () => clearTimeout(timer);
  }, [isPremium]);

  if (!isAdBlockActive || isPremium) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-xl bg-gradient-to-br from-red-600/20 to-black border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/40 animate-pulse">
                <ShieldAlert size={48} className="text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-6">
            {isRTL ? "تم اكتشاف مانع إعلانات!" : "Ad-Block Detected!"}
          </h2>
          
          <p className="text-gray-400 font-medium leading-relaxed mb-10 px-4">
            {isRTL 
              ? "نحن نقدم المحتوى مجاناً، والإعلانات هي ما تجعلنا نستمر. يرجى إيقاف مانع الإعلانات لدخول الموقع أو الحصول على نظام الـ VIP لتجربة نظيفة تماماً."
              : "VOZ Stream provides high-quality content for free. We rely on ads to keep the servers running. Please disable your Ad-Blocker or upgrade to VIP to continue."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-3 bg-white text-black h-16 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition active:scale-95"
            >
              <Unlock size={18} />
              {isRTL ? "أعد التحميل بعد الإيقاف" : "Refresh Page"}
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('viral-share-btn');
                if(el) el.click();
                setIsAdBlockActive(false);
              }}
              className="flex items-center justify-center gap-3 bg-primary-600 text-white h-16 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-600/20 hover:bg-primary-500 transition active:scale-95"
            >
              <Crown size={18} className="fill-white" />
              {isRTL ? "تفعيل VIP مجاناً" : "Get Free VIP"}
            </button>
          </div>

          <p className="mt-8 text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
            <Heart size={10} className="text-red-600" /> Support VOZ Protocol
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
