'use client';

import { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ReelItem as ReelItemType } from '@/hooks/useReels';
import { ReelVideoPlayer, ReelVideoPlayerHandle } from './ReelVideoPlayer';
import { ReelInfoBar } from './ReelInfoBar';
import { getPosterUrl } from '@/lib/tmdb';

interface ReelItemProps {
  item: ReelItemType;
  isVisible: boolean;
  isMuted: boolean;
  isFullscreen?: boolean;
  onMuteChange: (muted: boolean) => void;
  onInfoClick: () => void;
  onAuthRequired?: () => void;
  onPlayerRef?: (ref: ReelVideoPlayerHandle | null) => void;
  onVideoEnd?: () => void;
}

export const ReelItem = forwardRef<HTMLDivElement, ReelItemProps>(
  ({ item, isVisible, isMuted, isFullscreen, onMuteChange, onInfoClick, onAuthRequired, onPlayerRef, onVideoEnd }, ref) => {
    const backdropUrl = getPosterUrl(item.backdropPath, 'original');
    const playerRef = useRef<ReelVideoPlayerHandle>(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Pass player ref to parent
    useEffect(() => {
      onPlayerRef?.(playerRef.current);
      return () => onPlayerRef?.(null);
    }, [onPlayerRef]);

    // Track progress and playing state from player
    useEffect(() => {
      if (!isVisible) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setIsPlaying(false);
        return;
      }

      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          setProgress(playerRef.current.getProgress());
          setIsPlaying(playerRef.current.isPlaying());
        }
      }, 100);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    }, [isVisible]);

    // Auto-hide progress bar after playback starts
    useEffect(() => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (isPlaying) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowProgressBar(false);
        }, 2000);
      } else {
        setShowProgressBar(true);
      }

      return () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [isPlaying]);

    // Show progress bar on user interaction anywhere on screen
    const handleUserInteraction = useCallback(() => {
      setShowProgressBar(true);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (isPlaying) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowProgressBar(false);
        }, 2000);
      }
    }, [isPlaying]);

    const handleSeek = useCallback((percentage: number) => {
      playerRef.current?.seekTo(percentage);
      setProgress(percentage);
    }, []);

    return (
      <div
        ref={ref}
        data-reel-id={item.id}
        className="h-[100dvh] w-full relative snap-start snap-always bg-black"
        onMouseMove={handleUserInteraction}
        onTouchStart={handleUserInteraction}
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

        {/* Video - Below header (or full height in fullscreen) */}
        <div className={`absolute left-0 right-0 bottom-0 flex items-center justify-center ${
          isFullscreen ? 'top-0' : 'top-[52px] lg:top-[60px]'
        }`}>
          <div className="relative w-full h-full">
            <ReelVideoPlayer
              ref={playerRef}
              videoId={item.trailerKey}
              isVisible={isVisible}
              isMuted={isMuted}
              onMuteChange={onMuteChange}
              onVideoEnd={onVideoEnd}
            />
          </div>
        </div>

        {/* Info Bar - Thin strip at bottom */}
        <ReelInfoBar
          item={item}
          isMuted={isMuted}
          isExpanded={false}
          showProgressBar={showProgressBar}
          onMuteToggle={() => onMuteChange(!isMuted)}
          onInfoClick={onInfoClick}
          onAuthRequired={onAuthRequired}
          progress={progress}
          onSeek={handleSeek}
        />
      </div>
    );
  }
);

ReelItem.displayName = 'ReelItem';
