"use client";

import { Home, Compass, Sparkles, Heart, User } from "lucide-react";
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
  
  // Hide on admin and player pages for maximum focus
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/watch")) return null;

  const items = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Browse", icon: Compass, href: "/browse" },
    { label: "Mood AI", icon: Sparkles, href: "#", isMoodTrigger: true }, // Opens AI Mood
    { label: "List", icon: Heart, href: "/list" },
    { label: "Profile", icon: User, href: "/profiles" },
  ];

  const handleMoodClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch a custom event that VozMood listens to
    window.dispatchEvent(new CustomEvent('open-voz-mood'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        onClick={item.isMoodTrigger ? (e) => handleMoodClick(e as any) : undefined}
                        className={cn(
                            "tap-effect relative flex flex-col items-center gap-1 transition-all duration-300 w-full py-2",
                            isActive ? "text-primary scale-110" : "text-gray-500 hover:text-white"
                        )}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="bottomNavGlow"
                                className="absolute -top-4 w-6 h-6 bg-primary/20 blur-xl rounded-full"
                            />
                        )}
                        <item.icon 
                            size={20} 
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn(item.isMoodTrigger && "text-yellow-500")} 
                        />
                        <span className="text-[9px] font-black uppercase tracking-tighter italic">
                            {item.label}
                        </span>
                        {isActive && (
                            <motion.div 
                                layoutId="bottomNavDot"
                                className="h-1 w-1 bg-primary rounded-full mt-0.5 shadow-[0_0_8px_#e50914]" 
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    </div>
  );
}
