"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar" | "fr" | "es" | "hi" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    tvShows: "TV Shows",
    movies: "Movies",
    party: "Party",
    request: "Request",
    list: "My List",
    search: "Search...",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "Welcome to VOZ Stream",
    heroDescription: "Watch the latest movies, TV series, and anime in HD.",
    switchProfile: "Switch Profile",
    helpCenter: "Help Center",
    browse: "Browse",
    trending: "Trending Now",
    popular: "Popular on VOZ",
    topRated: "Top Rated",
    play: "Play",
    moreInfo: "More Info",
    addToList: "Add to List",
    family: "Family",
    horror: "Horror",
    khaleeji: "Khaleeji",
    action: "Action",
    comedy: "Comedy",
    arabicServers: "Arabic Servers",
    egybest: "EgyBest",
    wecima: "WeCima",
    akwam: "Akwam",
    fasel: "FaselHD",
  },
  ar: {
    home: "الرئيسية",
    tvShows: "مسلسلات",
    movies: "أفلام",
    party: "بارتي",
    request: "طلب محتوى",
    list: "قائمتي",
    search: "بحث...",
    signIn: "تسجيل الدخول",
    signOut: "خروج",
    welcome: "مرحباً بكم في فوز ستريم",
    heroDescription: "شاهد أحدث الأفلام والمسلسلات والأنيمي بدقة عالية.",
    switchProfile: "تبديل الحساب",
    helpCenter: "مركز المساعدة",
    browse: "تصفح",
    trending: "التريند الآن",
    popular: "الأكثر شعبية",
    topRated: "الأعلى تقييماً",
    play: "تشغيل",
    moreInfo: "مزيد من المعلومات",
    addToList: "إضافة للقائمة",
    family: "عائلي",
    horror: "رعب",
    khaleeji: "خليجي",
    action: "أكشن",
    comedy: "كوميدي",
    arabicServers: "سيرفرات عربية",
    egybest: "إيجي بست",
    wecima: "وي سيما",
    akwam: "أكوام",
    fasel: "فاصل إتش دي",
  },
  fr: {
    home: "Accueil",
    tvShows: "Séries TV",
    movies: "Films",
    party: "Fête",
    request: "Demander",
    list: "Ma liste",
    search: "Rechercher...",
    signIn: "Se connecter",
    signOut: "Déconnexion",
    welcome: "Bienvenue sur VOZ Stream",
    heroDescription: "Regardez les derniers films, séries TV et animes en HD.",
    switchProfile: "Changer de profil",
    helpCenter: "Centre d'aide",
    browse: "Parcourir",
    trending: "Tendances",
    popular: "Populaire",
    topRated: "Mieux notés",
    play: "Lecture",
    moreInfo: "Plus d'infos",
    addToList: "Ajouter à la liste",
  },
  es: {
    home: "Inicio",
    tvShows: "Series TV",
    movies: "Películas",
    party: "Fiesta",
    request: "Solicitar",
    list: "Mi lista",
    search: "Buscar...",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    welcome: "Bienvenido a VOZ Stream",
    heroDescription: "Mira las últimas películas, series de TV y anime en HD.",
    switchProfile: "Cambiar perfil",
    helpCenter: "Centro de ayuda",
    browse: "Explorar",
    trending: "Tendencias",
    popular: "Popular",
    topRated: "Mejor valorados",
    play: "Reproducir",
    moreInfo: "Más información",
    addToList: "Añadir a la lista",
  },
  hi: {
    home: "होम",
    tvShows: "टीवी शो",
    movies: "फिल्में",
    party: "पार्टी",
    request: "अनुरोध",
    list: "मेरी सूची",
    search: "खोजें...",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    welcome: "VOZ Stream में आपका स्वागत है",
    heroDescription: "नवीनतम फिल्में, टीवी श्रृंखला और एनीमे HD में देखें।",
    switchProfile: "प्रोफ़ाइल बदलें",
    helpCenter: "सहायता केंद्र",
    browse: "ब्राउज़ करें",
    trending: "अभी ट्रेंडिंग",
    popular: "लोकप्रिय",
    topRated: "टॉप रेटेड",
    play: "चलाएं",
    moreInfo: "अधिक जानकारी",
    addToList: "सूची में जोड़ें",
  },
  ru: {
    home: "Главная",
    tvShows: "ТВ-шоу",
    movies: "Фильмы",
    party: "Вечеринка",
    request: "Запрос",
    list: "Мой список",
    search: "Поиск...",
    signIn: "Войти",
    signOut: "Выйти",
    welcome: "Добро пожаловать в VOZ Stream",
    heroDescription: "Смотрите последние фильмы, сериалы и аниме в HD.",
    switchProfile: "Сменить профиль",
    helpCenter: "Центр помощи",
    browse: "Просмотр",
    trending: "В тренде",
    popular: "Популярно",
    topRated: "Лучшие",
    play: "Смотреть",
    moreInfo: "Подробнее",
    addToList: "В список",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("voz_lang") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("voz_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
