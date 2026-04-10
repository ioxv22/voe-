import type { Metadata } from "next";
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
};

import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";

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
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('keydown', e => {
            if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 'k')) {
              e.preventDefault();
            }
            if (e.key === 'F12') e.preventDefault();
          });
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-background select-none" suppressHydrationWarning>
        <AuthProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
