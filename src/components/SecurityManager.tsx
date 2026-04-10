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
        (e.metaKey && forbiddenKeys.includes(e.key)) || // Mac CMD keys
        e.key === 'F12' || 
        e.key === 'PrintScreen' ||
        (e.shiftKey && (e.key === 'S' || e.key === '4')) // Win+Shift+S or Mac CMD+Shift+4
      ) {
        setIsBlurred(true); // Instant blur on any capture shortcut attempt
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Mouse Leave Protection (Triggered when user moves mouse to start a capture tool)
    const handleMouseLeave = () => setIsBlurred(true);
    const handleMouseEnter = () => setIsBlurred(false);

    // 4. Focus & Visibility Change
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    const handleVisibilityChange = () => {
        setIsBlurred(document.visibilityState === 'hidden');
    };

    // 5. Detect Window Resizing (Common when capture tools open)
    const handleResize = () => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
            setIsBlurred(true);
        }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 6. Clipboard Scrubbing (Force clear on any copy attempt)
    const handleCopy = (e: ClipboardEvent) => {
        e.clipboardData?.setData('text/plain', 'Unauthorized Content Protection.');
        e.preventDefault();
    };
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
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
                <p className="text-gray-500 max-w-sm text-sm">Return to full-screen or active window to resume playback. Recording and screen capture are strictly forbidden.</p>
            </div>
        )}

        {/* Triple Dynamic Watermarks */}
        <Watermark id={1} initialPos={{x: 10, y: 10}} />
        <Watermark id={2} initialPos={{x: 80, y: 80}} />
        <Watermark id={3} initialPos={{x: 50, y: 40}} />
        
        <style jsx global>{`
            /* Root Level Protection */
            body {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background-color: #020202 !important;
            }
            video, iframe {
                pointer-events: none !important;
            }
            img {
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
            }
            @media print {
                body { visibility: hidden !important; display: none !important; }
            }
        `}</style>
    </div>
  );
}

function Watermark({ id, initialPos }: { id: number, initialPos: {x: number, y: number} }) {
    const [pos, setPos] = useState(initialPos);

    useEffect(() => {
        const interval = setInterval(() => {
            setPos({
                x: Math.random() * 85 + 5,
                y: Math.random() * 85 + 5
            });
        }, 5000 + id * 1000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div 
            className="fixed z-[9999] pointer-events-none opacity-[0.15] text-white font-black text-[12px] tracking-[0.3em] select-none transition-all duration-[2000ms] ease-in-out whitespace-nowrap"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            VOZ STREAM PROPERTY | @IIVOZ | #{id}
        </div>
    );
}
