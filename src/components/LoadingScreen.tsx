"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="flex items-center gap-1 text-4xl font-black tracking-tighter text-primary-600"
      >
        <span className="text-white">VOZ</span>
        <span className="bg-primary-600 px-1 text-black rounded-sm">STREAM</span>
      </motion.div>
    </div>
  );
}
