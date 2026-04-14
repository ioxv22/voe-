"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, User as UserIcon, Sun, Moon, Crown, Share2, Radio, Users, Eye, Lock, Save, Key, LayoutDashboard, Terminal, BellPlus, Activity, ShieldAlert, Megaphone, Settings, Trophy } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import SearchModal from "./SearchModal";
import NotificationPanel from "./NotificationPanel";
import RequestModal from "./RequestModal";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, limit, onSnapshot, orderBy, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "@/context/ThemeContext";

import { usePathname } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  if (pathname?.startsWith("/admin")) return null;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [alertBanner, setAlertBanner] = useState("");
  
  const { user, signInWithGoogle, logout } = useAuth();
  const { currentProfile } = useProfile();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    
    // Listen for notification changes
    const q = query(collection(db, "notifications"), orderBy("date", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotifCount(snapshot.size);
    });

    // Listen for global config
    const unsubConfig = onSnapshot(doc(db, "system", "config"), (doc) => {
        if (doc.exists()) {
            setAlertBanner(doc.data().alertBanner || "");
        }
    });

    return () => {
        window.removeEventListener("scroll", handleScroll);
        unsubscribe();
        unsubConfig();
    };
  }, []);

  const handleOpenNotif = () => {
      setIsNotifOpen(!isNotifOpen);
      setNotifCount(0); // Reset visual dot on open
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12",
        isScrolled ? "bg-background/90 backdrop-blur-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-8">
        <Logo />

        <ul className="hidden gap-6 text-sm font-medium text-muted lg:flex">
          <Link href="/"><li className="cursor-pointer transition hover:text-foreground">Home</li></Link>
          <Link href="/browse"><li className="cursor-pointer transition hover:text-foreground">TV Shows</li></Link>
          <Link href="/browse"><li className="cursor-pointer transition hover:text-foreground">Movies</li></Link>
          <Link href="/live"><li className="cursor-pointer transition hover:text-foreground flex items-center gap-1.5"><Radio size={14} className="text-red-500 animate-pulse" /> Live TV</li></Link>
          <Link href="/matches"><li className="cursor-pointer transition hover:text-foreground flex items-center gap-1.5"><Trophy size={14} className="text-green-500" /> Matches</li></Link>
          <Link href="/rooms"><li className="cursor-pointer transition hover:text-primary-500 font-bold flex items-center gap-1.5"><Radio size={14} className="text-primary-500 animate-pulse" /> Watch Party</li></Link>
          <li onClick={() => setIsRequestOpen(true)} className="cursor-pointer transition hover:text-foreground group flex items-center gap-1.5">
             <span className="relative">
                Request
                <span className="absolute -right-2 -top-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
             </span>
          </li>
          <li className="cursor-pointer transition hover:text-foreground">My List</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 text-muted lg:gap-6">
        <button onClick={toggleTheme} className="cursor-pointer hover:text-foreground transition-transform active:rotate-45">
          {theme === "dark" ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>

        <button onClick={() => setIsSearchOpen(true)} className="cursor-pointer hover:text-foreground">
          <Search size={20} strokeWidth={2.5} />
        </button>
        
        <button onClick={handleOpenNotif} className="relative cursor-pointer hover:text-foreground transition active:scale-90">
          <Bell size={20} strokeWidth={2.5} />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg animate-bounce">
                {notifCount}
            </span>
          )}
        </button>
        
        {user && currentProfile ? (
            <div className="relative">
                <div 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="h-8 w-8 cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-foreground/20 active:scale-90 transition shadow-lg"
                >
                    <img src={currentProfile.avatar} alt="Profile" className="h-full w-full object-cover" />
                </div>
                
                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-48 z-50">
                            <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-3xl p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                                <p className="px-3 py-2 text-[10px] font-bold text-muted border-b border-white/5 truncate uppercase tracking-widest flex items-center justify-between">
                                    {currentProfile.name}
                                    {(user?.isVIP || user?.isPremium) && <Crown size={12} className="text-yellow-500 fill-yellow-500" />}
                                </p>
                                <Link href="/profiles"><button className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition rounded-lg mt-1">Switch Profiles</button></Link>
                                <a href="https://t.me/iivoz" target="_blank"><button className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition rounded-lg">Help Center</button></a>
                                <button onClick={logout} className="w-full px-3 py-2 text-left text-xs font-bold text-primary transition hover:bg-primary/10 rounded-lg mt-1">Sign Out</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        ) : (
            <button 
                onClick={signInWithGoogle}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
                Sign In
            </button>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />

      {/* Global Alert Banner */}
      <AnimatePresence>
        {alertBanner && (
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-max max-w-[90vw] bg-primary-600 px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/20"
            >
                <Bell size={14} className="text-white animate-bounce" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{alertBanner}</span>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
