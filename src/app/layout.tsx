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
  title: "VOZ Stream - Premium Entertainment Discovery Protocol",
  description: "Watch the latest movies, TV series, and anime in HD. VOZ Stream is a high-speed, ad-free discovery platform for global audiences.",
  keywords: ["movies", "streaming", "anime", "TV series", "watch online", "HD streaming", "VOZ Stream"],
  authors: [{ name: "VOZ Team" }],
  openGraph: {
    title: "VOZ Stream | The Future of Streaming",
    description: "Experience ultra-fast streaming world-wide. No ads, just entertainment.",
    url: "https://voz-stream.vercel.app", // Replace with actual domain if known
    siteName: "VOZ Stream",
    images: [
      {
        url: "https://i.ibb.co/23Bkgcrx/image.png", // Use the app icon or a better banner
        width: 1200,
        height: 630,
        alt: "VOZ Stream Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOZ Stream | Watch Movies & TV",
    description: "The fastest streaming discovery platform on the web.",
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
import SecurityManager from "@/components/SecurityManager";
import VisitorTracker from "@/components/VisitorTracker";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import IOSInstallPrompt from "@/components/IOSInstallPrompt";
import Navbar from "@/components/Navbar";

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
      </head>
      <body className="min-h-full flex flex-col bg-background select-none" suppressHydrationWarning>
        <ThemeProvider>
          <VisitorTracker />
          <SecurityManager />
          <AuthProvider>
            <ProfileProvider>
              <Navbar />
              <MaintenanceGuard>
                <IOSInstallPrompt />
                {children}
              </MaintenanceGuard>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
