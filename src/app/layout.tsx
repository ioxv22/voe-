import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VistaFlix — Your World. Your Movies. | عالمك، أفلامك",
  description: "VistaFlix — منصة البث السينمائية الأولى. شاهد أحدث الأفلام والمسلسلات والأنمي والدراما بجودة HD/4K. Your World. Your Movies.",
  keywords: ["VistaFlix", "فيستا فليكس", "مشاهدة أفلام", "مسلسلات", "أفلام HD", "أنمي", "دراما", "بث مباشر", "Your World Your Movies"],
  authors: [{ name: "VistaFlix" }],
  openGraph: {
    title: "VistaFlix — Your World. Your Movies.",
    description: "عالمك، أفلامك. شاهد أفضل الأعمال السينمائية والمسلسلات الحصرية بجودة فائقة HD/4K.",
    url: "https://vistaflix.netlify.app",
    siteName: "VistaFlix",
    images: [
      {
        url: "https://i.ibb.co/TqWqYkK1/image.png",
        width: 1200,
        height: 630,
        alt: "VistaFlix — Your World. Your Movies.",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VistaFlix — Your World. Your Movies.",
    description: "عالمك، أفلامك. منصة البث السينمائية الأولى.",
    images: ["https://i.ibb.co/TqWqYkK1/image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VistaFlix",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SecurityManager from "@/components/SecurityManager";
import VisitorTracker from "@/components/VisitorTracker";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import IOSInstallPrompt from "@/components/IOSInstallPrompt";
import Navbar from "@/components/Navbar";
import VozMood from "@/components/VozMood";
import GlobalAlert from "@/components/GlobalAlert";
import TVOptimizer from "@/components/TVOptimizer";

import MobileBottomNav from "@/components/MobileBottomNav";
import OfflineIndicator from "@/components/OfflineIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&family=Montserrat:wght@400;600;700;900&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <link rel="icon" href="https://i.ibb.co/bjsvpftX/image.png" />
        <link rel="apple-touch-icon" href="https://i.ibb.co/bjsvpftX/image.png" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "VistaFlix",
              "url": "https://vistaflix.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://vistaflix.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-white select-none pb-20 lg:pb-0 font-premium" suppressHydrationWarning>
        <ThemeProvider>
          <OfflineIndicator />
          <LanguageProvider>
            <VisitorTracker />
            <SecurityManager />
            <AuthProvider>
              <ProfileProvider>
                <Navbar />
                <MaintenanceGuard>
                  <IOSInstallPrompt />
                  <VozMood />
                  <GlobalAlert />
                  <TVOptimizer />
                  {children}
                  <MobileBottomNav />
                </MaintenanceGuard>
              </ProfileProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
