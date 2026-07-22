"use client";

export function MovieRowSkeleton() {
  return (
    <div className="space-y-4 py-8 lg:px-12 px-4">
      <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[2/3] w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] skeleton-shimmer rounded-2xl flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] w-full skeleton-shimmer">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute bottom-[15%] left-4 lg:left-12 space-y-6 max-w-2xl">
        <div className="h-12 w-3/4 skeleton-shimmer rounded-xl opacity-20" />
        <div className="h-6 w-full skeleton-shimmer rounded-lg opacity-10" />
        <div className="flex gap-4">
          <div className="h-14 w-40 skeleton-shimmer rounded-full opacity-30" />
          <div className="h-14 w-40 skeleton-shimmer rounded-full opacity-30" />
        </div>
      </div>
    </div>
  );
}
