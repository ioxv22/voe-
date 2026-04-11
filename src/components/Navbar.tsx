"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, User as UserIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import SearchModal from "./SearchModal";
import NotificationPanel from "./NotificationPanel";
import RequestModal from "./RequestModal";
import Logo from "./Logo";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  
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

    return () => {
        window.removeEventListener("scroll", handleScroll);
        unsubscribe();
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
                                <p className="px-3 py-2 text-[10px] font-bold text-muted border-b border-white/5 truncate uppercase tracking-widest">{currentProfile.name}</p>
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
    </nav>
  );
}
