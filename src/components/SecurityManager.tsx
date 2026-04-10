"use client";

import { useEffect, useRef } from "react";

export default function SecurityManager() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Light deterrents to protect IP without lagging the app
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 'u' || e.key === 's')) || e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    
    // Low-frequency protocol sync
    const cleaner = setInterval(() => {
        console.clear();
        console.log("%cVOZ STREAM PROTECTED | BY HAMAD AL-ABDOULI", "color: #e50914; font-size: 14px; font-weight: bold;");
    }, 20000);

    return () => {
      clearInterval(cleaner);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {/* HAMAD'S BRANDED WATERMARKS - Rights Protection */}
        <div className="absolute top-10 left-10 opacity-10 text-white font-black text-[10px] tracking-widest uppercase select-none">
            VOZ STREAM | @IIVOZ
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 text-white font-black text-[10px] tracking-widest uppercase select-none flex flex-col items-end gap-1">
            <span>TIKTOK: H7MADDD</span>
            <span>SNAP: HAMADALABDOLLY</span>
        </div>
        
        <style jsx global>{`
            img { pointer-events: none; -webkit-user-drag: none; }
            body { background-color: #020202 !important; }
            /* Global selection color matched to Hamad's Brand */
            ::selection { background: #e50914; color: white; }
        `}</style>
    </div>
  );
}
