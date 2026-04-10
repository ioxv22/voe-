"use client";

import { useEffect, useState, useRef } from "react";

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
        {/* HAMAD'S BRANDED MOVING WATERMARKS */}
        <Watermark id={1} initialPos={{x: 10, y: 10}} text="VOZ STREAM | @IIVOZ" />
        <Watermark id={2} initialPos={{x: 80, y: 20}} text="TIKTOK: H7MADDD" />
        <Watermark id={3} initialPos={{x: 50, y: 80}} text="SNAP: HAMADALABDOLLY" />
        <Watermark id={4} initialPos={{x: 20, y: 60}} text="BUILT BY HAMAD AL-ABDOULI" />
        
        <style jsx global>{`
            img { pointer-events: none; -webkit-user-drag: none; }
            body { background-color: #020202 !important; }
            /* Global selection color matched to Hamad's Brand */
            ::selection { background: #e50914; color: white; }
        `}</style>
    </div>
  );
}

function Watermark({ id, initialPos, text }: { id: number, initialPos: {x: number, y: number}, text: string }) {
    const [pos, setPos] = useState(initialPos);
    
    useEffect(() => {
        // Slow interval to not cause lag, but keeps labels moving
        const interval = setInterval(() => {
            setPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        }, 12000 + id * 3000); // Staggered timers
        
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div 
            className="absolute opacity-10 text-white font-black text-[12px] tracking-widest uppercase select-none transition-all duration-[8000ms] ease-in-out whitespace-nowrap drop-shadow-md"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            {text}
        </div>
    );
}
