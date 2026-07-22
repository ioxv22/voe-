"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import DramaCard from "./DramaCard";
import { useLanguage } from "@/context/LanguageContext";

interface DramaRowProps {
  title: string;
  series: any[];
  isHighlighted?: boolean;
}

export default function DramaRow({ title, series, isHighlighted }: DramaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const { isRTL } = useLanguage();

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      setShowLeft(scrollTo > 0);
    }
  };

  if (!series || series.length === 0) return null;

  return (
    <div className={`space-y-4 px-4 lg:px-12 relative group/row ${isHighlighted ? 'py-8' : ''}`}>
      {isHighlighted && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
              {isHighlighted && <Zap size={18} className="text-primary animate-pulse" />}
              <h2 className="text-xl lg:text-3xl font-black italic uppercase tracking-tighter metallic-text select-none">
                  {title}
              </h2>
          </div>
          <div className="hidden lg:flex gap-2">
              <button 
                  onClick={() => handleScroll("left")}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-90"
              >
                  <ChevronLeft size={20} />
              </button>
              <button 
                  onClick={() => handleScroll("right")}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-90"
              >
                  <ChevronRight size={20} />
              </button>
          </div>
      </div>

      <div 
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {series.map((item) => (
          <DramaCard key={item.id} series={item} />
        ))}
      </div>
    </div>
  );
}
