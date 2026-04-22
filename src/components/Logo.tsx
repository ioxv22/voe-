import React from "react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <img 
        src="https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png" 
        alt="VOZ Stream" 
        className="h-10 w-auto object-contain transition drop-shadow-[0_0_8px_rgba(20,184,166,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]" 
      />
    </Link>
  );
}
