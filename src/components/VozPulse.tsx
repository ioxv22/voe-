"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";

export default function VozPulse() {
  const { isRTL } = useLanguage();
  const [currentTrend, setCurrentTrend] = useState("");
  const [visible, setVisible] = useState(false);

  const stats = [
    "1,240 people are watching 'Inside Out 2' right now",
    "New episode of 'The Boys' is trending in UAE",
    "VIP members just got early access to 'Deadpool & Wolverine'",
    "Highest quality stream available: 4K Ultra HD",
    "Join the Watch Party for the upcoming Match!",
  ];

  const statsAr = [
    "١,٢٤٠ شخص يشاهدون 'Inside Out 2' الآن",
    "حلقة جديدة من 'The Boys' تتصدر التريند في الإمارات",
    "أعضاء VIP حصلوا للتو على وصول مبكر لفيلم 'Deadpool & Wolverine'",
    "أعلى جودة متاحة: 4K Ultra HD",
    "انضم إلى حفلة المشاهدة للمباراة القادمة!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const list = isRTL ? statsAr : stats;
      setCurrentTrend(list[Math.floor(Math.random() * list.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    }, 15000);

    return () => clearInterval(interval);
  }, [isRTL]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={cn(
            "fixed bottom-6 z-[60] flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl",
            isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"
          )}
        >
          <div className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </div>
          <p className={cn("text-[10px] font-bold text-white whitespace-nowrap uppercase tracking-widest", isRTL && "font-arabic")}>
            {currentTrend}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
