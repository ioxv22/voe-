"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white p-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <WifiOff size={16} />
          <span>You are currently offline. Some features may be limited.</span>
        </motion.div>
      )}
      {showReconnected && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-green-600 text-white p-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <Wifi size={16} />
          <span>Connection restored! Enjoy VOZ Stream.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
