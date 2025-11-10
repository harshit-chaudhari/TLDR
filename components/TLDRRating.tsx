interface TLDRRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TLDRRating({ rating, size = 'md', showLabel = true }: TLDRRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-baseline gap-1 ${sizeClasses[size]}`}>
        {showLabel && (
          <span className="font-semibold text-tldr-gold tracking-wide">TLDR</span>
        )}
        <span className="font-bold text-white">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}
