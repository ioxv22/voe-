"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SmartAds() {
  const { isPremium } = useAuth();

  useEffect(() => {
    if (isPremium) return;

    // Monetag Popunder Integration
    const script = document.createElement("script");
    script.src = "//thubanoa.com/1?z=8640822"; // User's specific Monetag ID if they provide it, otherwise placeholder
    script.async = true;
    document.body.appendChild(script);

    // Native Ad Example (Monetag)
    const nativeScript = document.createElement("script");
    nativeScript.setAttribute("data-cfasync", "false");
    nativeScript.async = true;
    nativeScript.src = "//thubanoa.com/3?z=8640823";
    document.body.appendChild(nativeScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(nativeScript);
    };
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
        {/* Placeholder for native ad container if needed */}
    </div>
  );
}
