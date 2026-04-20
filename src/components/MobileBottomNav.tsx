"use client";

import { Home, Compass, Search, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/watch")) return null;

  const items = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Browse", icon: Compass, href: "/browse" },
    { label: "Search", icon: Search, href: "/search/ai" },
    { label: "My List", icon: Heart, href: "/browse" },
    { label: "Profile", icon: User, href: "/profiles" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[30px] border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl">
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all",
                            isActive ? "text-primary-500 scale-110" : "text-gray-500"
                        )}
                    >
                        <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    </div>
  );
}
