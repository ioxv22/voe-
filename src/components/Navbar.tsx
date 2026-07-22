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
  Crown, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Trophy,
  HardDrive
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
  const { user, signInWithGoogle, logout } = useAuth();
  const { currentProfile } = useProfile();
  const { t } = useLanguage();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
      if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') setDeferredPrompt(null);
      }
  };

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/browse?type=movie", label: "أفلام", icon: PlayCircle },
    { href: "/browse?type=tv", label: "مسلسلات", icon: Tv },
    { href: "/matches", label: "مباريات مباشر", icon: Trophy },
    { href: "/browse?genre=premium_arabic", label: "حصريات VistaFlix", icon: Crown },
    { href: "/browse?genre=watchlist", label: "قائمتي", icon: Bookmark },
    { href: "/rooms", label: "غرف المشاهدة", icon: Users },
  ];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav className={cn(
        "pill-nav",
        isScrolled && "pill-nav-compact"
      )}>
        {/* Left Section: Logo & Desktop Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo variant="full" size="md" />
          
          <ul className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={cn("nav-link", isActive && "nav-link-active")}>
                    <div className="flex items-center gap-2 font-bold text-xs tracking-wider">
                        <link.icon size={15} className={cn(isActive ? "text-[#E50914]" : "text-[#B3B3B3]")} />
                        <span>{link.label}</span>
                    </div>
                    {isActive && <motion.div layoutId="navDot" className="active-dot mt-1" />}
                </Link>
              );
            })}
          </ul>
        </div>

        {/* Right Section: Search, Notifs, Auth */}
        <div className="flex items-center gap-3">
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2 border-l border-[#333333] pl-3 ml-1">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 text-[#B3B3B3] hover:text-white hover:bg-white/5 rounded-xl transition"
                aria-label="Search"
              >
                <Search size={19} />
              </button>
              {deferredPrompt && (
                  <button 
                    onClick={handleInstall} 
                    className="p-2 text-[#E50914] hover:scale-110 transition animate-pulse"
                    aria-label="Install App"
                  >
                      <HardDrive size={19} />
                  </button>
              )}
              <NotificationHub />
              <button 
                onClick={() => window.open('https://t.me/VOZSTREAM', '_blank')}
                className="p-2 text-[#B3B3B3] hover:text-[#229ED9] hover:bg-white/5 rounded-xl transition"
                aria-label="Telegram"
              >
                <Send size={19} />
              </button>
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2.5 bg-[#171717] border border-[#333333] hover:border-[#E50914]/50 px-3.5 py-1.5 rounded-full font-bold text-xs transition hover:bg-[#242424]"
                >
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-black/40 border border-[#E50914]">
                        <img src={currentProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    <span className="text-white max-w-[100px] truncate">{currentProfile?.name || "المستخدم"}</span>
                </button>

                <AnimatePresence>
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-[110]" onClick={() => setIsProfileOpen(false)} />
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-3 w-56 rounded-2xl border border-[#333333] bg-[#171717] p-2 shadow-2xl z-[120]"
                            >
                                <Link href="/profiles" className="flex items-center gap-3 p-3 text-xs font-bold hover:bg-[#242424] rounded-xl transition text-white">
                                    <Users size={16} className="text-[#E50914]" /> تبديل الحساب
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 p-3 text-xs font-bold hover:bg-[#242424] rounded-xl transition text-white">
                                    <Settings size={16} className="text-[#B3B3B3]" /> إعدادات الحساب
                                </Link>
                                <div className="h-[1px] bg-[#333333] my-1.5" />
                                <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-xs font-bold text-[#E50914] hover:bg-[#E50914]/10 rounded-xl transition">
                                    <LogOut size={16} /> تسجيل الخروج
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
          ) : (
            <button 
                onClick={signInWithGoogle}
                className="btn-primary text-xs py-2 px-5 rounded-full"
            >
                دخول
            </button>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden p-2 text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
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
                    className="fixed top-0 right-0 h-full w-[82vw] max-w-sm bg-[#0B0B0B] border-l border-[#333333] z-[160] p-6 flex flex-col"
                  >
                      <div className="flex justify-between items-center mb-8">
                          <Logo variant="full" size="md" />
                          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#B3B3B3] hover:text-white"><X size={24} /></button>
                      </div>

                      <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                  key={link.href} 
                                  href={link.href} 
                                  onClick={() => setIsMobileMenuOpen(false)} 
                                  className="flex items-center gap-3.5 p-3 rounded-xl text-base font-bold text-white hover:bg-[#171717] hover:text-[#E50914] transition"
                                >
                                    <link.icon size={20} className="text-[#E50914]" /> 
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-[#333333] space-y-3">
                            <button onClick={() => window.open('https://t.me/VOZSTREAM', '_blank')} className="w-full flex items-center justify-center gap-3 p-3.5 bg-[#229ED9]/10 text-[#229ED9] rounded-xl font-bold border border-[#229ED9]/20">
                                <Send size={18} /> قناتنا على تلغرام
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
