import React from "react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <img 
        src="https://i.ibb.co/23Bkgcrx/image.png" 
        alt="VOZ Stream" 
        className="h-10 w-auto object-contain brightness-110 group-hover:scale-105 transition" 
      />
      <div className="flex flex-col -space-y-1">
        <span className="text-xl font-black tracking-tighter text-white">VOZ</span>
        <span className="text-[10px] font-bold tracking-widest text-primary-600">STREAM</span>
      </div>
    </Link>
  );
}
