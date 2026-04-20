"use client";

import { useEffect, useState, useRef } from "react";

export default function SecurityManager() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Anti-Tamper: MutationObserver to protect watermarks
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                console.error("DOM TAMPER DETECTED: RESTORING PROTECTED NODES");
            }
        });
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Block DevTools and Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
            (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p')) ||
            (e.metaKey && e.altKey && e.key === 'i')
        ) {
            e.preventDefault();
            return false;
        }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    
    const cleaner = setInterval(() => {
        console.clear();
        console.log("%cVOZ STREAM PROTECTED | BY HAMAD AL-ABDOULI", "color: #e50914; font-size: 14px; font-weight: bold;");
    }, 20000);

    return () => {
      clearInterval(cleaner);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
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
            .protected-img { pointer-events: none; -webkit-user-drag: none; }
            body { background-color: var(--background) !important; }
            ::selection { background: var(--primary); color: white; }
        `}</style>
    </div>
  );
}

function Watermark({ id, initialPos, text }: { id: number, initialPos: {x: number, y: number}, text: string }) {
    const [pos, setPos] = useState(initialPos);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        }, 12000 + id * 3000);
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
