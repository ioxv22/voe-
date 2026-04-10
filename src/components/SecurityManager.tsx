"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Optimized Security Manager (Light Version)
 * Allows screenshots while maintaining brand rights via watermarks.
 */
export default function SecurityManager() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Light Deterrents: Disable common source viewing shortucts but ALLOW screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      // Still block "View Source" and "Save Page" to protect idea/code
      if ((e.ctrlKey && (e.key === 'u' || e.key === 's')) || e.key === 'F12') {
        e.preventDefault();
      }
    };

    // 2. Clear Console (Keep it clean)
    const consoleKiller = setInterval(() => {
        console.clear();
        console.log("%cVOZ STREAM PROTECTED", "color: #3b82f6; font-size: 20px; font-weight: bold;");
    }, 5000);

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearInterval(consoleKiller);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div ref={containerRef}>
        {/* Dynamic Watermarks (The "Rights" part) */}
        {/* We keep these as they act as a "Signature" even in screenshots */}
        <Watermark id={1} initialPos={{x: 10, y: 10}} />
        <Watermark id={2} initialPos={{x: 80, y: 80}} />
        
        <style jsx global>{`
            /* Prevent image scraping but allow viewing */
            img, video, iframe {
                -webkit-user-drag: none;
                user-select: none;
            }
            body {
                background-color: #020202 !important;
            }
        `}</style>
    </div>
  );
}

function Watermark({ id, initialPos }: { id: number, initialPos: {x: number, y: number} }) {
    const [pos, setPos] = useState(initialPos);
    useEffect(() => {
        const interval = setInterval(() => {
            setPos({ x: Math.random() * 85 + 5, y: Math.random() * 85 + 5 });
        }, 8000 + id * 2000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div 
            className="fixed z-[9999] pointer-events-none opacity-[0.2] text-white font-bold text-[11px] tracking-[0.2em] select-none transition-all duration-[3000ms] ease-in-out whitespace-nowrap uppercase"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            VOZ STREAM | @IIVOZ
        </div>
    );
}
