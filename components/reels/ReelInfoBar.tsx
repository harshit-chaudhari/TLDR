'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ReelItem } from '@/hooks/useReels';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PlatformLogo } from '@/components/PlatformLogo';

interface ReelInfoBarProps {
  item: ReelItem;
  isMuted: boolean;
  isExpanded: boolean;
  showProgressBar?: boolean;
  onMuteToggle: () => void;
  onInfoClick: () => void;
  onAuthRequired?: () => void;
  progress?: number;
  onSeek?: (percentage: number) => void;
}

export function ReelInfoBar({
  item,
  isMuted,
  showProgressBar = true,
  onMuteToggle,
  onInfoClick,
  onAuthRequired,
  progress = 0,
  onSeek,
}: ReelInfoBarProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const favoriteContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Handle progress bar seek
  const handleProgressInteraction = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!progressBarRef.current || !onSeek) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    onSeek(percentage);
  }, [onSeek]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSeeking(true);
    handleProgressInteraction(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleProgressInteraction(moveEvent);
    };

    const handleMouseUp = () => {
      setIsSeeking(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleProgressInteraction]);

  const handleProgressTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (!progressBarRef.current || !onSeek) return;
    setIsSeeking(true);
    const rect = progressBarRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    onSeek(percentage);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const touch = moveEvent.touches[0];
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      onSeek(percentage);
    };

    const handleTouchEnd = () => {
      setIsSeeking(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [onSeek]);

  // Listen for keyboard shortcut 'L' to toggle favorite
  useEffect(() => {
    const handleToggleFavorite = (e: CustomEvent) => {
      if (e.detail.id === item.id && e.detail.mediaType === item.mediaType) {
        const button = favoriteContainerRef.current?.querySelector('button');
        button?.click();
      }
    };

    window.addEventListener('toggleFavorite', handleToggleFavorite as EventListener);
    return () => window.removeEventListener('toggleFavorite', handleToggleFavorite as EventListener);
  }, [item.id, item.mediaType]);

  // Listen for keyboard shortcut 'S' to trigger share
  useEffect(() => {
    const handleTriggerShare = (e: CustomEvent) => {
      if (e.detail.id === item.id && e.detail.mediaType === item.mediaType) {
        handleShare();
      }
    };

    window.addEventListener('triggerShare', handleTriggerShare as EventListener);
    return () => window.removeEventListener('triggerShare', handleTriggerShare as EventListener);
  }, [item.id, item.mediaType]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/previews?id=${item.id}&type=${item.mediaType}`;
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

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* Progressive blur background - multiple layers for smooth fade */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base gradient - solid at bottom, fades up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        {/* Extended blur zone that fades out */}
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)'
          }}
        />
      </div>

      {/* Progress Bar - at top of info panel */}
      <div
        className={`relative px-4 lg:px-6 pt-3 transition-opacity duration-300 ${
          showProgressBar || isHoveringProgress || isSeeking ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsHoveringProgress(true)}
        onMouseLeave={() => setIsHoveringProgress(false)}
      >
        <div
          ref={progressBarRef}
          className={`relative bg-white/20 rounded-full cursor-pointer transition-all duration-200 ${
            isHoveringProgress || isSeeking ? 'h-1.5' : 'h-[3px]'
          }`}
          onMouseDown={handleProgressMouseDown}
          onTouchStart={handleProgressTouchStart}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-[#e69d2e] rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-200 ${
              isHoveringProgress || isSeeking ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Single row: Title/meta on left, controls on right */}
      <div className="relative px-4 py-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Title + meta */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-2xl lg:text-[28px] font-semibold truncate">
            {item.title}
          </h2>
          <div className="flex items-center gap-2 text-white/60 text-base font-medium mt-2.5">
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
            <span className="text-white/30">•</span>
            <span>{item.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          </div>
        </div>

        {/* Watch CTA */}
        {item.platform && item.watchLink && (
          <a
            href={item.watchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-colors shrink-0"
          >
            <PlatformLogo
              platform={item.platform}
              isSelected={true}
              size="badge"
              logoPath={item.platformLogo}
            />
            <span className="text-white/90 font-medium text-sm whitespace-nowrap">
              Watch on {item.platform}
            </span>
          </a>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Mute/Unmute */}
          <button
            onClick={onMuteToggle}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
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
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <FavoriteButton
              tmdbId={item.id}
              mediaType={item.mediaType}
              title={item.title}
              posterPath={item.posterPath}
              size="md"
              onAuthRequired={onAuthRequired}
            />
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            aria-label="Share"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {showCopied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded whitespace-nowrap font-medium">
                Copied!
              </span>
            )}
          </button>

          {/* More Info */}
          <button
            onClick={onInfoClick}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
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
