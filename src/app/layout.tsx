/* VOZ_DEPLOY_SYNC: 2026-04-20_17-18 */
import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOZ Stream - Watch FREE Movies & TV Series in HD | No Ads Discovery",
  description: "VOZ Stream is the #1 platform to watch latest movies, TV series, and anime in HD for free. Fast, secure, and ad-free experience for global audiences.",
  keywords: ["watch free movies", "streaming site 2026", "free anime hd", "watch tv shows online", "VOZ Stream movies", "no ads streaming", "free netflix alternative"],
  authors: [{ name: "VOZ Team" }],
  openGraph: {
    title: "VOZ Stream | The Future of Free Streaming",
    description: "Ultra-fast streaming world-wide. Watch your favorite content in HD without annoying ads.",
    url: "https://vozstream.vercel.app",
    siteName: "VOZ Stream",
    images: [
      {
        url: "https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png",
        width: 1200,
        height: 630,
        alt: "VOZ Stream - Free HD Streaming",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOZ Stream | Watch FREE HD Movies",
    description: "The fastest streaming discovery platform. No ads, just movies.",
    images: ["https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VOZ Stream",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#020202",
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
import ViralShare from "@/components/ViralShare";
import AntiAdBlock from "@/components/AntiAdBlock";

import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#020202" />
          <link rel="apple-touch-icon" href="https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png" />
          {/* Structured Data for Google (SEO) */}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "VOZ Stream",
                "url": "https://vozstream.vercel.app",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://vozstream.vercel.app/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
      </head>
      <body className="min-h-full flex flex-col bg-background select-none pb-20 lg:pb-0" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <VisitorTracker />
            <SecurityManager />
            <AuthProvider>
              <ProfileProvider>
                <Navbar />
                <MaintenanceGuard>
                  <IOSInstallPrompt />
                  <VozMood />
                  <ViralShare />
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
