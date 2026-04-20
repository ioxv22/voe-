"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Home, 
  PlayCircle, 
  Tv, 
  Bookmark, 
  Users, 
  Send, 
  Search, 
  Bell, 
  Crown, 
  Settings, 
  LogOut, 
  HandHelping,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import SearchModal from "./SearchModal";
import NotificationHub from "./NotificationHub";
import VozVipModal from "./VozVipModal";
import RequestModal from "./RequestModal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { user, signInWithGoogle, logout, isPremium } = useAuth();
  const { currentProfile } = useProfile();
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/browse/movies", label: t("movies") || "Movies", icon: PlayCircle },
    { href: "/browse/tv", label: t("tvShows") || "TV Shows", icon: Tv },
    { href: "/list", label: t("list") || "My List", icon: Bookmark },
    { href: "/rooms", label: t("party") || "Rooms", icon: Users },
  ];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav className={cn(
        "pill-nav",
        isScrolled && "pill-nav-compact"
      )}>
        {/* Left Section: Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <Logo className="hidden lg:block h-6" />
          
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={cn("nav-link", isActive && "nav-link-active")}>
                    <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider">
                        <link.icon size={16} className={cn(isActive ? "text-primary" : "text-gray-500")} />
                        {link.label}
                    </div>
                    {isActive && <motion.div layoutId="navDot" className="active-dot mt-1" />}
                </Link>
              );
            })}
          </ul>
        </div>

        {/* Right Section: Search, Notifs, Auth */}
        <div className="flex items-center gap-4">
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2 hidden md:flex">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-400 hover:text-white transition">
                <Search size={20} />
              </button>
              <NotificationHub />
              <button 
                onClick={() => window.open('https://t.me/VOZSTREAM', '_blank')}
                className="p-2 text-gray-400 hover:text-[#229ED9] transition"
              >
                <Send size={20} />
              </button>
          </div>

          {/* Ads Toggle Indicator (Stig Style) */}
          <div className="hidden lg:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <div className={cn("ads-status-dot", isPremium ? "ads-off" : "ads-on")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {isPremium ? "Ads Blocked" : "Ads On"}
              </span>
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-widest transition hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                    <div className="h-5 w-5 rounded-md overflow-hidden bg-black/20">
                        <img src={currentProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="w-full h-full object-cover" />
                    </div>
                    <span>{currentProfile?.name || "User"}</span>
                </button>

                <AnimatePresence>
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-[110]" onClick={() => setIsProfileOpen(false)} />
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 w-52 rounded-3xl border border-white/10 bg-black/95 backdrop-blur-3xl p-2 shadow-2xl z-[120]"
                            >
                                <Link href="/profiles" className="flex items-center gap-3 p-3 text-xs font-bold hover:bg-white/5 rounded-2xl transition">
                                    <Users size={16} className="text-gray-500" /> Switch Profile
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 p-3 text-xs font-bold hover:bg-white/5 rounded-2xl transition">
                                    <Settings size={16} className="text-gray-500" /> Account Hub
                                </Link>
                                <button onClick={() => setIsVipOpen(true)} className="w-full flex items-center gap-3 p-3 text-xs font-bold hover:bg-yellow-500/10 text-yellow-500 rounded-2xl transition">
                                    <Crown size={16} /> Upgrade to VIP
                                </button>
                                <div className="h-[1px] bg-white/5 my-2" />
                                <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition">
                                    <LogOut size={16} /> Disconnect
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
                <button 
                    onClick={signInWithGoogle}
                    className="bg-primary px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition"
                >
                    Sign In
                </button>
                <button 
                   onClick={signInWithGoogle}
                   className="hidden md:block bg-white/10 px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest text-white hover:bg-white/20 transition"
                >
                    Sign Up
                </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Stig Style) */}
      <AnimatePresence>
          {isMobileMenuOpen && (
              <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <motion.div 
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className="fixed top-0 right-0 h-full w-[80vw] bg-black border-l border-white/5 z-[160] p-8 flex flex-col"
                  >
                      <div className="flex justify-between items-center mb-12">
                          <Logo className="h-6" />
                          <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                      </div>

                      <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-2xl font-black uppercase italic tracking-tighter hover:text-primary transition">
                                    <link.icon size={24} /> {link.label}
                                </Link>
                            ))}
                            <button onClick={() => { setIsMobileMenuOpen(false); setIsRequestOpen(true); }} className="flex items-center gap-4 text-2xl font-black uppercase italic tracking-tighter hover:text-primary transition">
                                <HandHelping size={24} /> {t("request")}
                            </button>
                      </div>

                      <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                            <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="w-full flex items-center gap-3 p-4 bg-white/5 rounded-2xl font-bold">
                                <Search size={20} /> Search Anything
                            </button>
                            <button onClick={() => window.open('https://t.me/VOZSTREAM', '_blank')} className="w-full flex items-center gap-3 p-4 bg-[#229ED9]/10 text-[#229ED9] rounded-2xl font-bold">
                                <Send size={20} /> Telegram Channel
                            </button>
                      </div>
                  </motion.div>
              </>
          )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <VozVipModal isOpen={isVipOpen} onClose={() => setIsVipOpen(false)} />
      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
    </>
  );
}
