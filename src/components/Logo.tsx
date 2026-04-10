import React from "react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="VOZ Stream" 
        className="h-10 w-auto object-contain transition" 
      />
    </Link>
  );
}
