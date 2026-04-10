"use client";

import { useEffect, useState, useRef } from "react";

export default function SecurityManager() {
  const [isBlurred, setIsBlurred] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Ultra-Aggressive Key Blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ['s', 'u', 'i', 'j', 'k', 'c', 'p', 'Shift', 'Meta', 'Alt'];
      if (
        (e.ctrlKey && forbiddenKeys.includes(e.key)) ||
        (e.metaKey && forbiddenKeys.includes(e.key)) || 
        e.key === 'F12' || 
        e.key === 'PrintScreen' ||
        (e.shiftKey && (e.key === 'S' || e.key === '4'))
      ) {
        setIsBlurred(true);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Smart DevTools Deterrent (Non-recursive)
    const debuggerLoop = setInterval(() => {
        const startTime = Date.now();
        // This is a common trick: 'debugger' interrupts execution if console is open.
        // We measure the time. If it takes > 100ms, console is likely open.
        (function() {}).constructor("debugger")();
        const endTime = Date.now();
        if (endTime - startTime > 100) {
             console.clear();
             console.log("%cSECURITY ALERT", "color: red; font-size: 30px;");
             // Optional: window.location.href = "about:blank";
        }
    }, 1000);

    // 4. Console Cleaning (Less frequent)
    const consoleKiller = setInterval(() => {
        console.clear();
    }, 2000);

    // 5. Detection for Console opening
    const detectConsole = () => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
             setIsBlurred(true);
        }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', detectConsole);
    window.addEventListener('blur', () => setIsBlurred(true));
    window.addEventListener('focus', () => setIsBlurred(false));
    document.addEventListener('visibilitychange', () => setIsBlurred(document.visibilityState === 'hidden'));

    return () => {
      clearInterval(debuggerLoop);
      clearInterval(consoleKiller);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div ref={containerRef}>
        {/* Anti-Capture Overlay */}
        {isBlurred && (
            <div className="fixed inset-0 z-[99999] bg-[#020202] backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 transition-opacity duration-300">
                <img src="https://i.ibb.co/23Bkgcrx/image.png" className="h-20 mx-auto mb-8 animate-pulse grayscale" />
                <div className="h-px w-32 bg-primary-600 mb-8" />
                <h2 className="text-4xl font-black text-white tracking-widest uppercase mb-4">Content Protected</h2>
                <p className="text-gray-500 max-w-sm text-sm">Security protocols active. Return to active window to resume.</p>
            </div>
        )}

        {/* Moving Watermarks */}
        <Watermark id={1} initialPos={{x: 10, y: 10}} />
        <Watermark id={2} initialPos={{x: 80, y: 80}} />
        
        <style jsx global>{`
            body {
                -webkit-touch-callout: none;
                user-select: none;
                background-color: #020202 !important;
            }
            img, video, iframe {
                pointer-events: none !important;
                -webkit-user-drag: none;
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
        }, 5000 + id * 1000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div 
            className="fixed z-[9999] pointer-events-none opacity-[0.1] text-white font-black text-[10px] tracking-[0.3em] select-none transition-all duration-[2000ms] ease-in-out whitespace-nowrap uppercase"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            PRIVATE PROPERTY | VOZ STREAM | @IIVOZ
        </div>
    );
}
