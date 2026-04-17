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
import { collection, query, limit, onSnapshot, orderBy, doc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage, type Language } from "@/context/LanguageContext";

import { usePathname } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ar", label: "العربية", flag: "🇦🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  if (pathname?.startsWith("/admin")) return null;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [alertBanner, setAlertBanner] = useState("");
  
  const { user, signInWithGoogle, logout, isPremium } = useAuth();
  const { currentProfile } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    
    // Listen for notification changes (limit to last 12h)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const q = query(
        collection(db, "notifications"), 
        where("date", ">=", twelveHoursAgo),
        orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotifCount(snapshot.size);
    });

    // Listen for global config
    const unsubConfig = onSnapshot(doc(db, "system", "config"), (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            const timestamp = data.alertTimestamp?.toDate();
            const now = new Date();
            const diffHours = timestamp ? (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60) : 0;
            
            if (data.alertBanner && (!timestamp || diffHours < 12)) {
                setAlertBanner(data.alertBanner);
            } else {
                setAlertBanner("");
            }
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
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12",
        isScrolled ? "bg-background/90 backdrop-blur-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-8">
        <Logo />

        <ul className={cn(
          "hidden gap-3 xl:gap-6 text-[11px] xl:text-sm font-medium text-muted lg:flex items-center",
          isRTL && "font-arabic"
        )}>
          <Link href="/"><li className="cursor-pointer transition-colors hover:text-white">{t("home")}</li></Link>
          <Link href="/browse"><li className="cursor-pointer transition-colors hover:text-white">{t("tvShows")}</li></Link>
          <Link href="/browse"><li className="cursor-pointer transition-colors hover:text-white">{t("movies")}</li></Link>
          
          <li className="relative group/cat">
            <span className="cursor-pointer transition-colors hover:text-white flex items-center gap-1.5 font-medium">
              {t("browse")}
            </span>
            <div className={cn(
              "absolute top-full left-0 mt-3 w-44 hidden group-hover/cat:block z-50 animate-in fade-in slide-in-from-top-2 duration-200",
              isRTL && "left-auto right-0"
            )}>
              <div className="rounded-2xl border border-white/10 bg-black/95 backdrop-blur-3xl p-2 shadow-2xl ring-1 ring-white/5">
                <Link href="/browse?genre=khaleeji"><button className="w-full px-4 py-2.5 text-left text-xs hover:bg-white/5 transition rounded-xl flex items-center gap-3">🌴 {t("khaleeji")}</button></Link>
                <Link href="/browse?genre=family"><button className="w-full px-4 py-2.5 text-left text-xs hover:bg-white/5 transition rounded-xl flex items-center gap-3">👨‍👩‍👧 {t("family")}</button></Link>
                <Link href="/browse?genre=horror"><button className="w-full px-4 py-2.5 text-left text-xs hover:bg-white/5 transition rounded-xl flex items-center gap-3">👻 {t("horror")}</button></Link>
                <Link href="/browse?genre=action"><button className="w-full px-4 py-2.5 text-left text-xs hover:bg-white/5 transition rounded-xl flex items-center gap-3">💥 {t("action")}</button></Link>
              </div>
            </div>
          </li>

          <Link href="/rooms">
            <li className="cursor-pointer transition-all hover:text-primary-400 font-bold flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <Radio size={16} className="text-primary-500" />
                <span className="absolute h-full w-full rounded-full bg-primary-500/20 animate-ping" />
              </div>
              {t("party")}
            </li>
          </Link>
          <li onClick={() => setIsRequestOpen(true)} className="cursor-pointer transition-colors hover:text-white group flex items-center gap-2">
             <span className="relative">
                {t("request")}
                <span className="absolute -right-2 -top-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
             </span>
          </li>
          <Link href="/browse">
            <li className="cursor-pointer transition-colors hover:text-white font-medium">
              {t("list")}
            </li>
          </Link>
        </ul>
      </div>

      <div className="flex items-center gap-4 text-muted lg:gap-6">
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors uppercase text-xs font-bold"
          >
            {LANGUAGES.find(l => l.code === language)?.flag} {language}
          </button>
          
          <AnimatePresence>
            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "absolute top-full mt-2 w-32 z-50 rounded-xl border border-white/10 bg-black/90 backdrop-blur-3xl p-1 shadow-2xl",
                    isRTL ? "left-0" : "right-0"
                  )}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition rounded-lg flex items-center gap-2",
                        language === lang.code && "text-primary font-bold"
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
            <div className="flex items-center gap-3">
                {isPremium && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/20"
                  >
                    <Crown size={16} className="text-white fill-white" />
                  </motion.div>
                )}
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
                        <div className={cn(
                          "absolute top-full mt-2 w-48 z-50",
                          isRTL ? "left-0" : "right-0"
                        )}>
                            <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-3xl p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                                <p className="px-3 py-2 text-[10px] font-bold text-muted border-b border-white/5 truncate uppercase tracking-widest flex items-center justify-between">
                                    {currentProfile.name}
                                    {(user?.isVIP || user?.isPremium) && <Crown size={12} className="text-yellow-500 fill-yellow-500" />}
                                </p>
                                <Link href="/profiles"><button className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition rounded-lg mt-1">{t("switchProfile")}</button></Link>
                                <a href="https://t.me/iivoz" target="_blank"><button className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition rounded-lg">{t("helpCenter")}</button></a>
                                <button onClick={logout} className="w-full px-3 py-2 text-left text-xs font-bold text-primary transition hover:bg-primary/10 rounded-lg mt-1">{t("signOut")}</button>
                            </div>
                        </div>
                    </>
                )}
                </div>
            </div>
        ) : (
            <button 
                onClick={signInWithGoogle}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
                {t("signIn")}
            </button>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />

      {/* Global Alert Banner with 12h expiry */}
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
