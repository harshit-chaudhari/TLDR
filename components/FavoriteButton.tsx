'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onAuthRequired?: () => void;
}

export function FavoriteButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  size = 'md',
  showLabel = false,
  className = '',
  onAuthRequired,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const favorited = isFavorited(tmdbId, mediaType);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      onAuthRequired?.();
      return;
    }

    setIsAnimating(true);
    await toggleFavorite({ tmdbId, mediaType, title, posterPath });

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} relative flex items-center justify-center transition-all ${
        favorited ? 'text-[#e69d2e]' : 'text-white/80 hover:text-white'
      } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      title={favorited ? 'Remove from favorites' : user ? 'Add to favorites' : 'Sign in to favorite'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${sizeClasses[size]} transition-all ${isAnimating ? 'animate-pulse' : ''}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}

// Variant for displaying favorited indicator on posters
export function FavoritedIndicator() {
  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="w-6 h-6 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-[#e69d2e] drop-shadow-lg"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
    </div>
  );
}
