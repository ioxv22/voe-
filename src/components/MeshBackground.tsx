"use client";

export default function MeshBackground() {
  return (
    <div className="mesh-container pointer-events-none">
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="absolute inset-0 bg-black/40" /> {/* Subtle overlay for text readability */}
    </div>
  );
}
