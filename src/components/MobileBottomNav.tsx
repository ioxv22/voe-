"use client";

import { Home, Sparkles, Heart, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/watch")) return null;

  const items = [
    { label: "الرئيسية", icon: Home, href: "/" },
    { label: "البحث", icon: Search, href: "/search" },
    { label: "المود الذكي", icon: Sparkles, href: "#", isMoodTrigger: true },
    { label: "قائمتي", icon: Heart, href: "/browse?genre=watchlist" },
    { label: "الحساب", icon: User, href: "/profiles" },
  ];

  const handleMoodClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-voz-mood'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[24px] border border-[#333333] bg-[#0B0B0B]/90 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        onClick={item.isMoodTrigger ? (e) => handleMoodClick(e as any) : undefined}
                        className={cn(
                            "relative flex flex-col items-center gap-1 transition-all duration-200 w-full py-2",
                            isActive ? "text-[#E50914] font-bold" : "text-[#B3B3B3] hover:text-white"
                        )}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="bottomNavGlow"
                                className="absolute -top-3 w-6 h-6 bg-[#E50914]/20 blur-lg rounded-full"
                            />
                        )}
                        <item.icon 
                            size={19} 
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn(item.isMoodTrigger && "text-yellow-400")} 
                        />
                        <span className="text-[10px] font-bold tracking-tight">
                            {item.label}
                        </span>
                        {isActive && (
                            <motion.div 
                                layoutId="bottomNavDot"
                                className="h-1 w-1 bg-[#E50914] rounded-full mt-0.5 shadow-[0_0_8px_#E50914]" 
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    </div>
  );
}
