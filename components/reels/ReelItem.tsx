'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ReelItem as ReelItemType } from '@/hooks/useReels';
import { ReelVideoPlayer, ReelVideoPlayerHandle } from './ReelVideoPlayer';
import { ReelInfoBar } from './ReelInfoBar';
import { getPosterUrl } from '@/lib/tmdb';

interface ReelItemProps {
  item: ReelItemType;
  isVisible: boolean;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
  onInfoClick: () => void;
  onAuthRequired?: () => void;
  onPlayerRef?: (ref: ReelVideoPlayerHandle | null) => void;
}

export const ReelItem = forwardRef<HTMLDivElement, ReelItemProps>(
  ({ item, isVisible, isMuted, onMuteChange, onInfoClick, onAuthRequired, onPlayerRef }, ref) => {
    const backdropUrl = getPosterUrl(item.backdropPath, 'original');
    const playerRef = useRef<ReelVideoPlayerHandle>(null);

    // Pass player ref to parent
    useEffect(() => {
      onPlayerRef?.(playerRef.current);
      return () => onPlayerRef?.(null);
    }, [onPlayerRef]);

    return (
      <div
        ref={ref}
        data-reel-id={item.id}
        className="h-[100dvh] w-full relative snap-start snap-always bg-black"
      >
        {/* Background - blurred backdrop (fallback) */}
        <div className="absolute inset-0 overflow-hidden">
          {item.backdropPath && (
            <Image
              src={backdropUrl}
              alt=""
              fill
              className="object-cover blur-2xl scale-110 opacity-20"
              priority={isVisible}
            />
          )}
        </div>

        {/* Video - Below header */}
        <div className="absolute top-[52px] lg:top-[60px] left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <ReelVideoPlayer
              ref={playerRef}
              videoId={item.trailerKey}
              isVisible={isVisible}
              isMuted={isMuted}
              onMuteChange={onMuteChange}
            />
          </div>
        </div>

        {/* Info Bar - Thin strip at bottom */}
        <ReelInfoBar
          item={item}
          isMuted={isMuted}
          isExpanded={false}
          onMuteToggle={() => onMuteChange(!isMuted)}
          onInfoClick={onInfoClick}
          onAuthRequired={onAuthRequired}
        />
      </div>
    );
  }
);

ReelItem.displayName = 'ReelItem';
