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
  const reelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const playerRefs = useRef<Map<number, ReelVideoPlayerHandle>>(new Map());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Prevent rapid scroll changes
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Details overlay state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReelItemType | null>(null);

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
        const currentItem = items[currentIndex];
        if (currentItem) {
          const playerRef = playerRefs.current.get(currentItem.id);
          playerRef?.togglePlayPause();
        }
      }
      // M for mute
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
      // L for like/favorite
      else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
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
      // D for details
      else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem) {
          handleInfoClick(currentItem);
        }
      }
      // Escape to go back
      else if (e.key === 'Escape') {
        window.location.href = '/';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showDetails, items, scrollToIndex]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleInfoClick = useCallback((item: ReelItemType) => {
    // Pause current video when opening details
    const playerRef = playerRefs.current.get(item.id);
    playerRef?.pause();
    setSelectedItem(item);
    setShowDetails(true);
  }, []);

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
    <>
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
            onMuteChange={setIsMuted}
            onInfoClick={() => handleInfoClick(item)}
            onAuthRequired={onAuthRequired}
            onPlayerRef={(ref) => setPlayerRef(item.id, ref)}
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
      </div>

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
    </>
  );
}
