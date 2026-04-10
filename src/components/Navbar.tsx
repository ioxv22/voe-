"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12",
        isScrolled ? "bg-[#0b0b0b]/90 backdrop-blur-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="group flex items-center gap-1 text-2xl font-black tracking-tighter text-primary-600">
          <span className="text-white group-hover:text-primary-600 transition-colors">VOZ</span>
          <span className="bg-primary-600 px-1 text-black rounded-sm">STREAM</span>
        </Link>

        <ul className="hidden gap-6 text-sm font-medium text-gray-300 lg:flex">
          <Link href="/"><li className="cursor-pointer transition hover:text-white">Home</li></Link>
          <li className="cursor-pointer transition hover:text-white">TV Shows</li>
          <li className="cursor-pointer transition hover:text-white">Movies</li>
          <li className="cursor-pointer transition hover:text-white">New & Popular</li>
          <li className="cursor-pointer transition hover:text-white">My List</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 text-gray-300 lg:gap-6">
        <button onClick={() => setIsSearchOpen(true)} className="cursor-pointer hover:text-white">
          <Search size={20} strokeWidth={2.5} />
        </button>
        <button className="relative cursor-pointer hover:text-white">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
            2
          </span>
        </button>
        
        {user ? (
            <div className="group relative">
                <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-white/20">
                    <img src={user.photoURL || ""} alt="Profile" className="h-full w-full object-cover" />
                </div>
                {/* Profile Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 scale-95 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                    <div className="rounded-md border border-white/10 bg-[#0b0b0b] p-2 shadow-xl">
                        <p className="px-3 py-2 text-xs font-bold text-gray-400 border-b border-white/5 truncate">{user.displayName}</p>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/5">Account</button>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/5">Help Center</button>
                        <button onClick={logout} className="w-full px-3 py-2 text-left text-sm font-bold text-primary-600 hover:bg-white/5">Sign Out</button>
                    </div>
                </div>
            </div>
        ) : (
            <button 
                onClick={signInWithGoogle}
                className="rounded-md bg-primary-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-primary-700"
            >
                Sign In
            </button>
        )}
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
