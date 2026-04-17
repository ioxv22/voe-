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
        url: "https://i.ibb.co/23Bkgcrx/image.png",
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
    images: ["https://i.ibb.co/23Bkgcrx/image.png"],
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
  maximumScale: 1,
  userScalable: false,
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
import AIChat from "@/components/AIChat";
import VozMood from "@/components/VozMood";
import VozPulse from "@/components/VozPulse";
import ViralShare from "@/components/ViralShare";
import AntiAdBlock from "@/components/AntiAdBlock";

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
          <link rel="apple-touch-icon" href="https://i.ibb.co/23Bkgcrx/image.png" />
          {/* Monetag Global Tag */}
          <Script
            id="monetag-ad"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(s){
                  if(window.location.pathname.startsWith('/admin')) return;
                  if(localStorage.getItem('voz_instant_vip') === 'true' || localStorage.getItem('isVIP') === 'true') return;
                  s.dataset.zone='10887963';
                  s.src='https://al5sm.com/tag.min.js';
                })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
                
                // Ad Sanitizer & Redirect Guard (Global)
                (function() {
                  const originalOpen = window.open;
                  window.open = function(url, name, specs) {
                    const currentOrigin = window.location.origin;
                    if (url && typeof url === 'string' && !url.includes(currentOrigin) && !url.includes('google') && !url.includes('firebase')) {
                      console.log('Ad Redirect Filtered: Bouncing back to VOZ.');
                      // Force suspicious ad-redirects back to our domain
                      originalOpen(currentOrigin, '_blank');
                      return null;
                    }
                    return originalOpen.apply(this, arguments);
                  };
                  
                  window.addEventListener('blur', function() {
                      setTimeout(() => {
                          if (document.activeElement instanceof HTMLIFrameElement) {
                              console.log('Iframe interaction detected');
                          }
                      }, 100);
                  });
                })();

                // Ad Janitor: Cleanup for VIP users
                setInterval(() => {
                  if(localStorage.getItem('voz_instant_vip') === 'true' || localStorage.getItem('isVIP') === 'true') {
                    const zones = ['10887963', '229810'];
                    // Remove propeller/monetag specific injected stuff if possible
                    var elements = document.querySelectorAll('iframe[src*="propeller"], div[id*="pro-"]');
                    for(var i=0; i<elements.length; i++) elements[i].remove();
                    
                    const adElements = document.querySelectorAll('ins, .ad-unit, [class*="ad-"]');
                    adElements.forEach(ad => ad.remove());
                  }
                }, 2000);
              `,
            }}
          />
          {/* RichAds Push Notifications with VIP Check */}
          <Script
             id="richads-push"
             strategy="afterInteractive"
             dangerouslySetInnerHTML={{
               __html: `
                (function(){
                  if(localStorage.getItem('voz_instant_vip') === 'true' || localStorage.getItem('isVIP') === 'true') {
                    console.log('RichAds Disabled: VIP User detected.');
                    return;
                  }
                  var s = document.createElement('script');
                  s.type = 'module';
                  s.async = true;
                  s.dataset.cfasync = 'false';
                  s.src = 'https://richinfo.co/richpartners/push/js/rp-cl-ob.js?pubid=1008770&siteid=394345&niche=33';
                  document.head.appendChild(s);
                })();
               `
             }}
          />
      </head>
      <body className="min-h-full flex flex-col bg-background select-none" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <VisitorTracker />
            <SecurityManager />
            <AuthProvider>
              <ProfileProvider>
                <Navbar />
                <MaintenanceGuard>
                  <IOSInstallPrompt />
                  <AIChat />
                  <VozMood />
                  <VozPulse />
                  <ViralShare />
                  <AntiAdBlock />
                  {children}
                </MaintenanceGuard>
              </ProfileProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
