'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useReels, ReelItem as ReelItemType } from '@/hooks/useReels';
import { TMDBMovie, TMDBShow } from '@/lib/tmdb';
import { ReelItem } from './ReelItem';
import { ReelVideoPlayerHandle } from './ReelVideoPlayer';
import dynamic from 'next/dynamic';

const DetailsOverlay = dynamic(() => import('@/components/DetailsOverlay'), { ssr: false });

interface ReelsFeedProps {
  onAuthRequired?: () => void;
}

export function ReelsFeed({ onAuthRequired }: ReelsFeedProps) {
  const { items, isLoading, error, hasMore, loadMore } = useReels();
  const containerRef = useRef<HTMLDivElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const playerRefs = useRef<Map<number, ReelVideoPlayerHandle>>(new Map());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prevent rapid scroll changes
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Details overlay state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReelItemType | null>(null);

  // Auto-advance state - track if user has interacted
  const hasUserInteractedRef = useRef(false);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showEndFrame, setShowEndFrame] = useState(false);

  // Mark user as having interacted (stops auto-advance)
  const markUserInteraction = useCallback(() => {
    hasUserInteractedRef.current = true;
    // Clear any pending auto-advance
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  }, []);

  // Pause all videos except the current one
  const pauseAllExcept = useCallback((exceptIndex: number) => {
    playerRefs.current.forEach((playerRef, id) => {
      const itemIndex = items.findIndex(item => item.id === id);
      if (itemIndex !== exceptIndex && playerRef) {
        playerRef.pause();
      }
    });
  }, [items]);

  // Set up Intersection Observer - only track which item is visible
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't process if we're in the middle of a programmatic scroll
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const reelId = entry.target.getAttribute('data-reel-id');
            const index = items.findIndex((item) => String(item.id) === reelId);

            if (index !== -1 && index !== currentIndex) {
              pauseAllExcept(index);
              setCurrentIndex(index);
            }
          }
        });
      },
      {
        threshold: [0.6, 0.7, 0.8, 0.9],
        root: containerRef.current
      }
    );

    reelRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [items, currentIndex, pauseAllExcept]);

  // Load more when nearing end
  useEffect(() => {
    if (currentIndex >= items.length - 3 && hasMore && !isLoading) {
      loadMore();
    }
  }, [currentIndex, items.length, hasMore, isLoading, loadMore]);

  // Scroll to specific index with debouncing
  const scrollToIndex = useCallback((index: number) => {
    if (index < 0 || index >= items.length) return;
    if (isScrollingRef.current) return; // Prevent rapid scrolling

    // Set scrolling flag
    isScrollingRef.current = true;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset user interaction flag for next trailer's auto-advance
    hasUserInteractedRef.current = false;
    setShowEndFrame(false);

    // Pause all videos immediately
    pauseAllExcept(index);

    // Update index immediately for UI
    setCurrentIndex(index);

    const ref = reelRefs.current.get(items[index].id);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Reset scrolling flag after animation completes
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  }, [items, pauseAllExcept]);

  // Fullscreen toggle function - defined BEFORE keyboard effect that uses it
  const toggleFullscreen = useCallback(async () => {
    const container = feedContainerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // handleInfoClick - defined BEFORE keyboard effect that uses it
  const handleInfoClick = useCallback((item: ReelItemType) => {
    // Mark as user interaction to stop auto-advance
    markUserInteraction();
    // Pause current video when opening details
    const playerRef = playerRefs.current.get(item.id);
    playerRef?.pause();
    setSelectedItem(item);
    setShowDetails(true);
  }, [markUserInteraction]);

  // Handle video end - show end frame then auto-advance if no interaction
  const handleVideoEnd = useCallback((itemId: number) => {
    // Only process if this is the current video
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== currentIndex) return;

    // If user has interacted, don't auto-advance
    if (hasUserInteractedRef.current) return;

    // If this is the last item, don't auto-advance
    if (currentIndex >= items.length - 1) return;

    // Show end frame indicator
    setShowEndFrame(true);

    // Auto-advance after delay (800-1000ms)
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      setShowEndFrame(false);
      // Double-check user hasn't interacted during the delay
      if (!hasUserInteractedRef.current) {
        scrollToIndex(currentIndex + 1);
      }
    }, 1000);
  }, [items, currentIndex, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDetails) return;

      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Arrow keys for navigation
      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      }
      // Spacebar for play/pause
      else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        markUserInteraction(); // User paused - stop auto-advance
        const currentItem = items[currentIndex];
        if (currentItem) {
          const playerRef = playerRefs.current.get(currentItem.id);
          playerRef?.togglePlayPause();
        }
      }
      // M for mute
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        markUserInteraction(); // User toggled mute - stop auto-advance
        setIsMuted((prev) => !prev);
      }
      // L for like/favorite
      else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        markUserInteraction(); // User liked - stop auto-advance
        // Trigger favorite on current item - dispatch custom event
        const currentItem = items[currentIndex];
        if (currentItem) {
          window.dispatchEvent(new CustomEvent('toggleFavorite', {
            detail: { id: currentItem.id, mediaType: currentItem.mediaType }
          }));
        }
      }
      // S for share
      else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem) {
          window.dispatchEvent(new CustomEvent('triggerShare', {
            detail: { id: currentItem.id, mediaType: currentItem.mediaType }
          }));
        }
      }
      // Enter for details
      else if (e.key === 'Enter') {
        e.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem) {
          handleInfoClick(currentItem);
        }
      }
      // F for fullscreen (our custom fullscreen with info panel)
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Escape to exit fullscreen or go back
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          window.location.href = '/';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showDetails, items, scrollToIndex, toggleFullscreen, handleInfoClick, markUserInteraction]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Wrapper for mute change that tracks interaction
  const handleMuteChange = useCallback((muted: boolean) => {
    markUserInteraction();
    setIsMuted(muted);
  }, [markUserInteraction]);

  const setReelRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) {
      reelRefs.current.set(id, el);
    } else {
      reelRefs.current.delete(id);
    }
  }, []);

  const setPlayerRef = useCallback((id: number, ref: ReelVideoPlayerHandle | null) => {
    if (ref) {
      playerRefs.current.set(id, ref);
    } else {
      playerRefs.current.delete(id);
    }
  }, []);

  if (error) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-white/60 mb-4">Failed to load trailers</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#e69d2e] text-black rounded-lg font-semibold text-sm hover:bg-[#d08c26] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#e69d2e]/20 border-t-[#e69d2e] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading trailers...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={feedContainerRef} className="relative bg-[#0a0a0a]">
      <div
        ref={containerRef}
        className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollSnapType: 'y mandatory',
          overscrollBehavior: 'contain',
        }}
      >
        {items.map((item, index) => (
          <ReelItem
            key={`${item.id}-${item.mediaType}`}
            ref={(el) => setReelRef(item.id, el)}
            item={item}
            isVisible={index === currentIndex}
            isMuted={isMuted}
            isFullscreen={isFullscreen}
            onMuteChange={handleMuteChange}
            onInfoClick={() => handleInfoClick(item)}
            onAuthRequired={onAuthRequired}
            onPlayerRef={(ref) => setPlayerRef(item.id, ref)}
            onVideoEnd={() => handleVideoEnd(item.id)}
          />
        ))}

        {/* Loading indicator at bottom */}
        {isLoading && items.length > 0 && (
          <div className="h-20 flex items-center justify-center snap-start">
            <div className="w-6 h-6 border-2 border-[#e69d2e]/20 border-t-[#e69d2e] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Scroll navigation - Desktop only */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-2 z-40">
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0 || isScrollingRef.current}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === items.length - 1 || isScrollingRef.current}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      </div>

      {/* Auto-advance transition indicator */}
      {showEndFrame && (
        <div className="fixed inset-x-0 bottom-32 z-50 flex justify-center pointer-events-none">
          <div className="flex items-center gap-3 px-5 py-3 bg-black/70 backdrop-blur-md rounded-full border border-white/10 animate-fade-in">
            <div className="relative w-5 h-5">
              {/* Circular progress indicator */}
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="#e69d2e"
                  strokeWidth="2"
                  strokeDasharray="50.27"
                  strokeDashoffset="50.27"
                  className="animate-progress-circle"
                />
              </svg>
            </div>
            <span className="text-white/90 text-sm font-medium">Next trailer</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Details Overlay */}
      {showDetails && selectedItem && (
        <DetailsOverlay
          items={items.map(item => ({
            id: item.id,
            title: item.mediaType === 'movie' ? item.title : undefined,
            name: item.mediaType === 'tv' ? item.title : undefined,
            poster_path: item.posterPath,
            backdrop_path: item.backdropPath,
            overview: item.overview,
            vote_average: item.voteAverage,
            media_type: item.mediaType,
            release_date: '',
            first_air_date: '',
            genre_ids: [],
          })) as (TMDBMovie | TMDBShow)[]}
          initialIndex={items.findIndex(item => item.id === selectedItem.id)}
          mediaType={selectedItem.mediaType}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
