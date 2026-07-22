"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "lucide-react";

export default function PinModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  correctPin, 
  profileName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: () => void, 
  correctPin: string,
  profileName: string
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val.slice(-1);
    setPin(newPin);
    setError(false);

    // Auto focus next or verify
    if (val && idx < 3) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    } else if (val && idx === 3) {
      const fullPin = newPin.join("");
      if (fullPin === correctPin) {
        onSuccess();
        setPin(["", "", "", ""]);
      } else {
        setError(true);
        setPin(["", "", "", ""]);
        document.getElementById(`pin-0`)?.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center">
             <motion.div 
               initial={{ y: 20 }}
               animate={{ y: 0 }}
               className="mb-8"
             >
                <Lock className="text-primary-600 mb-4 mx-auto" size={48} />
                <h3 className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-2">Profile Locked</h3>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Enter PIN for {profileName}</h2>
             </motion.div>

             <div className="flex gap-4 mb-8">
               {pin.map((digit, i) => (
                 <input 
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    autoFocus={i === 0}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    className={`w-14 h-20 bg-white/5 border-2 rounded-2xl text-center text-3xl font-black text-white outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'focus:border-primary-600 border-white/10'}`}
                 />
               ))}
             </div>

             {error && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs font-bold uppercase tracking-widest animate-bounce"
                >
                    Incorrect PIN. Data access denied.
                </motion.p>
             )}

             <button 
                onClick={onClose}
                className="mt-12 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition"
             >
                Exit Secure Mode
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
