export function SkeletonLoader({ type }: { type: 'top10' | 'grid' | 'horizontal' }) {
  if (type === 'top10') {
    return (
      <div className="grid grid-cols-5 gap-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="relative border border-[#1a1a1a] overflow-hidden">
            <div className="relative aspect-[2/3] bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <div className="relative aspect-[2/3] bg-[#0a0a0a] rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // horizontal
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-[258px]">
          <div className="relative overflow-hidden rounded-lg mb-3">
            <div className="relative aspect-[2/3] bg-[#0a0a0a] rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="h-4 bg-[#1a1a1a] rounded w-20 mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
