'use client';

import { useState, useEffect, useRef } from 'react';
import { ReelItem } from '@/hooks/useReels';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PlatformLogo } from '@/components/PlatformLogo';

interface PeekInfoPanelProps {
  item: ReelItem;
  isMuted: boolean;
  onMuteToggle: () => void;
  onInfoClick: () => void;
  onAuthRequired?: () => void;
}

export function PeekInfoPanel({
  item,
  isMuted,
  onMuteToggle,
  onInfoClick,
  onAuthRequired,
}: PeekInfoPanelProps) {
  const [showCopied, setShowCopied] = useState(false);
  const favoriteContainerRef = useRef<HTMLDivElement>(null);

  // Listen for keyboard shortcut 'L' to toggle favorite
  useEffect(() => {
    const handleToggleFavorite = (e: CustomEvent) => {
      if (e.detail.id === item.id && e.detail.mediaType === item.mediaType) {
        // Find and click the button inside the container
        const button = favoriteContainerRef.current?.querySelector('button');
        button?.click();
      }
    };

    window.addEventListener('toggleFavorite', handleToggleFavorite as EventListener);
    return () => window.removeEventListener('toggleFavorite', handleToggleFavorite as EventListener);
  }, [item.id, item.mediaType]);


  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/reels?id=${item.id}&type=${item.mediaType}`;
    const shareData = {
      title: item.title,
      text: `Check out ${item.title} on TLDR`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  // Format runtime
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="w-full flex flex-col">
      {/* Content Info */}
      <div className="space-y-2">
        {/* Title */}
        <h2 className="text-white text-xl lg:text-2xl font-bold leading-tight line-clamp-2">
          {item.title}
        </h2>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-white/60 text-sm">
          {item.voteAverage > 0 && (
            <span className="flex items-center gap-1 text-[#e69d2e]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {item.voteAverage.toFixed(1)}
            </span>
          )}
          {item.releaseYear > 0 && (
            <>
              <span className="text-white/30">•</span>
              <span>{item.releaseYear}</span>
            </>
          )}
          {item.runtime && (
            <>
              <span className="text-white/30">•</span>
              <span>{formatRuntime(item.runtime)}</span>
            </>
          )}
          <span className="text-white/30">•</span>
          <span className="capitalize">{item.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
        </div>

        {/* Genres - compact */}
        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 text-xs text-white/50 bg-white/10 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview - shorter */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
          {item.overview}
        </p>

        {/* Platform CTA - compact */}
        {item.platform && item.watchLink && (
          <a
            href={item.watchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <PlatformLogo
              platform={item.platform}
              isSelected={true}
              size="badge"
              logoPath={item.platformLogo}
            />
            <span className="text-white font-medium">Watch on {item.platform}</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {/* Action Buttons - horizontal row */}
        <div className="flex items-center gap-2 pt-1">
          {/* Mute/Unmute */}
          <button
            onClick={onMuteToggle}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Favorite */}
          <div
            ref={favoriteContainerRef}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <FavoriteButton
              tmdbId={item.id}
              mediaType={item.mediaType}
              title={item.title}
              posterPath={item.posterPath}
              size="sm"
              onAuthRequired={onAuthRequired}
            />
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            aria-label="Share"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {showCopied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded whitespace-nowrap font-medium">
                Link copied!
              </span>
            )}
          </button>

          {/* More Info */}
          <button
            onClick={onInfoClick}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            aria-label="More info"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
