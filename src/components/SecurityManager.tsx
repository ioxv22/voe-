"use client";

import { useEffect, useRef } from "react";

export default function SecurityManager() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Light deterrents only. Avoid heavy loops to prevent "Hangs"
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 'u' || e.key === 's')) || e.key === 'F12') {
        e.preventDefault();
      }
    };

    const handleContext = (e: MouseEvent) => {
        // Allow right click but protect images if needed
    };

    document.addEventListener('keydown', handleKeyDown, true);
    
    // Low-frequency sync
    const cleaner = setInterval(() => {
        console.clear();
        console.log("%cVOZ STREAM PROTECTED", "color: #e50914; font-size: 14px; font-weight: bold;");
    }, 15000);

    return () => {
      clearInterval(cleaner);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {/* Stationary corners - less CPU usage than moving watermarks */}
        <div className="absolute top-10 left-10 opacity-10 text-white font-black text-[10px] tracking-widest uppercase select-none">VOZ STREAM | DXB</div>
        <div className="absolute bottom-10 right-10 opacity-10 text-white font-black text-[10px] tracking-widest uppercase select-none">@IIVOZ PROTOCOL</div>
        
        <style jsx global>{`
            img { pointer-events: none; -webkit-user-drag: none; }
            body { background-color: #020202 !important; }
        `}</style>
    </div>
  );
}
