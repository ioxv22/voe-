import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "white" | "red";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export default function Logo({
  className = "",
  variant = "full",
  size = "md",
  showTagline = false,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 text-lg",
    md: "h-9 text-xl lg:text-2xl",
    lg: "h-12 text-3xl",
    xl: "h-16 text-4xl",
  };

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] active:scale-95 ${className}`}
      aria-label="VistaFlix Home"
    >
      {/* VistaFlix Brand Icon (SVG + Image Fallback) */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <img
          src="https://i.ibb.co/bjsvpftX/image.png"
          alt="VistaFlix Icon"
          className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(255,45,61,0.7)] transition-all duration-300"
        />
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col justify-center">
          <div className={`font-black tracking-tight font-['Montserrat'] leading-none ${sizeClasses[size]}`}>
            <span className={variant === "white" ? "text-white" : "text-white"}>VISTA</span>
            <span className={variant === "white" ? "text-white/90" : "text-[#E50914]"}>FLIX</span>
          </div>
          {showTagline && (
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#B3B3B3] uppercase mt-1">
              Your World. Your Movies.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
