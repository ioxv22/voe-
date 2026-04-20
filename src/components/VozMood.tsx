"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Smile, Frown, Flame, Zap, Ghost, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const MOODS = [
  { id: "happy", icon: <Smile className="text-yellow-400" />, label: "Happy", genre: 35 }, // Comedy
  { id: "sad", icon: <Frown className="text-blue-400" />, label: "Sad", genre: 18 }, // Drama
  { id: "excited", icon: <Zap className="text-purple-400" />, label: "Excited", genre: 28 }, // Action
  { id: "romantic", icon: <Heart className="text-pink-400" />, label: "Romantic", genre: 10749 }, // Romance
  { id: "scared", icon: <Ghost className="text-gray-400" />, label: "Scared", genre: 27 }, // Horror
  { id: "energetic", icon: <Flame className="text-orange-400" />, label: "Hyped", genre: 12 }, // Adventure
];

export default function VozMood() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-voz-mood', handleOpen);
    return () => window.removeEventListener('open-voz-mood', handleOpen);
  }, []);

  const getRecommendation = async (genreId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/discover/movie?with_genres=${genreId}`);
      const data = await res.json();
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      setRecommendation(randomMovie);
    } catch (error) {
      console.error("Mood error:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 z-40 hidden lg:flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-2xl transition hover:scale-110 active:scale-95 lg:h-16 lg:w-16",
          isRTL ? "left-6" : "right-6"
        )}
      >
        <Sparkles className="text-white" size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed bottom-44 z-50 w-[90vw] max-w-md rounded-3xl border border-white/10 bg-black/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(229,9,20,0.3)]",
              isRTL ? "left-6" : "right-6"
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className={cn("text-xl font-black text-white", isRTL && "font-arabic")}>
                  {isRTL ? "كيف تشعر اليوم؟" : "How are you feeling?"}
                </h3>
                <p className={cn("text-xs text-muted", isRTL && "font-arabic")}>
                  {isRTL ? "سأقترح لك فيلماً يناسب مزاجك" : "I'll suggest a movie for your mood"}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full bg-white/5 p-2 hover:bg-white/10">
                <X size={20} className="text-white" />
              </button>
            </div>

            {!recommendation ? (
              <div className="grid grid-cols-3 gap-3">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => getRecommendation(mood.genre)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 transition hover:bg-primary/20 group"
                  >
                    <div className="text-2xl transition group-hover:scale-125">{mood.icon}</div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider text-white", isRTL && "font-arabic")}>
                      {isRTL ? mood.id : mood.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${recommendation.backdrop_path}`}
                    className="h-full w-full object-cover"
                    alt={recommendation.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-bold text-white line-clamp-1">{recommendation.title}</h4>
                    <p className="text-[10px] text-gray-300">⭐ {recommendation.vote_average}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/watch/movie/${recommendation.id}`} className="flex-1">
                    <button className="w-full rounded-lg bg-primary py-2 text-sm font-bold text-white">
                      {t("play")}
                    </button>
                  </Link>
                  <button
                    onClick={() => setRecommendation(null)}
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white"
                  >
                    {isRTL ? "مرة أخرى" : "Try Again"}
                  </button>
                </div>
              </motion.div>
            )}
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
