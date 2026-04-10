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
  title: "VOZ Stream | Watch Movies, TV Series & Anime Online in HD",
  description: "VOZ Stream is a premium entertainment discovery platform for movies, TV series, and anime in HD.",
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
import SecurityManager from "@/components/SecurityManager";
import AdManager from "@/components/AdManager";

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
          <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8867564621500356" 
            crossOrigin="anonymous" 
          ></script>
          <Script 
            src="https://pl29118911.profitablecpmratenetwork.com/94/fe/c5/94fec515712decf5618381e9375b08aa.js" 
            strategy="afterInteractive"
          />
          <link rel="apple-touch-icon" href="https://i.ibb.co/23Bkgcrx/image.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background select-none" suppressHydrationWarning>
        <ThemeProvider>
          <SecurityManager />
          <AuthProvider>
            <ProfileProvider>
              <AdManager />
              {children}
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
