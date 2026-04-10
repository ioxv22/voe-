"use client";

import { useEffect, useState } from "react";

export default function SecurityManager() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    // 1. Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Disable DevTools & Screenshots shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // S, U, I, J, K, C, PrintScreen
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 'k' || e.key === 'c' || e.key === 'p')) ||
        e.key === 'F12' || e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
            alert("Security Policy: Screen capture is strictly disabled.");
        }
      }
    };

    // 3. Detect Tab/Window Focus Loss (Prevents most external screen capture tools)
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    // 4. Visibility Change
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') setIsBlurred(true);
        else setIsBlurred(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Anti-PrintScreen Hack (Copies empty string to clipboard on PrintScreen)
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText("");
            alert("Screenshots are strictly prohibited on VOZ Stream.");
        }
    };
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
        {/* Anti-Screenshot Overlay (Blurs content when user leaves tab) */}
        {isBlurred && (
            <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-3xl flex items-center justify-center text-center p-8">
                <div className="space-y-4">
                    <img src="https://i.ibb.co/23Bkgcrx/image.png" className="h-20 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl font-black text-white">PROTECTED CONTENT</h2>
                    <p className="text-gray-500 max-w-sm">Screen capture is disabled to protect intellectual property. Please return to the tab to continue watching.</p>
                </div>
            </div>
        )}

        {/* Dynamic Moving Watermark (@iivoz) */}
        <Watermark />
        
        <style jsx global>{`
            /* Prevent image dragging */
            img {
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
            }
            /* Hide content on print */
            @media print {
                body { display: none !important; }
            }
        `}</style>
    </>
  );
}

function Watermark() {
    const [pos, setPos] = useState({ x: 10, y: 10 });

    useEffect(() => {
        const interval = setInterval(() => {
            setPos({
                x: Math.random() * 80 + 5,
                y: Math.random() * 80 + 5
            });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className="fixed z-[9999] pointer-events-none opacity-20 text-white font-black text-sm tracking-widest select-none transition-all duration-1000 ease-in-out uppercase"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
            VOZ STREAM | @IIVOZ | PROPERTY OF HAMAD
        </div>
    );
}
