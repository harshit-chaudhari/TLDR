'use client';

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface ReelVideoPlayerHandle {
  togglePlayPause: () => void;
  isPlaying: () => boolean;
  pause: () => void;
}

interface ReelVideoPlayerProps {
  videoId: string;
  isVisible: boolean;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
}

export const ReelVideoPlayer = forwardRef<ReelVideoPlayerHandle, ReelVideoPlayerProps>(({
  videoId,
  isVisible,
  isMuted,
  onMuteChange,
}, ref) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerId = useRef(`peek-player-${videoId}-${Math.random().toString(36).substr(2, 9)}`);
  const isMutedRef = useRef(isMuted);
  const wasVisibleRef = useRef(false);

  // Keep muted ref in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Force pause function - called externally to ensure video stops
  const forcePause = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    togglePlayPause: () => {
      if (!playerRef.current || !isReady) return;
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    },
    isPlaying: () => isPlaying,
    pause: forcePause,
  }), [isReady, isPlaying, forcePause]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize player
  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(playerId.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          playsinline: 1,
          loop: 1,
          playlist: videoId,
          mute: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          initPlayer();
        }
      }, 100);

      return () => clearInterval(checkYT);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Player might already be destroyed
        }
        playerRef.current = null;
        setIsReady(false);
        setIsPlaying(false);
      }
    };
  }, [videoId]);

  // Handle visibility changes - CRITICAL for single video playback
  useEffect(() => {
    const player = playerRef.current;

    // ALWAYS pause immediately when visibility changes to false, even if not ready
    if (!isVisible && wasVisibleRef.current) {
      if (player) {
        try {
          player.pauseVideo();
        } catch (e) {
          // Ignore
        }
      }
    }

    // Update visibility tracking
    wasVisibleRef.current = isVisible;

    // Only proceed with play logic if ready
    if (!player || !isReady) return;

    if (isVisible) {
      // Small delay to ensure previous video has paused
      const playTimeout = setTimeout(() => {
        try {
          // Apply current mute state
          if (isMutedRef.current) {
            player.mute();
          } else {
            player.unMute();
          }
          // Start playing
          player.playVideo();
        } catch (e) {
          // Ignore errors
        }
      }, 50);

      // Fallback: if autoplay blocked, retry muted
      const checkPlayback = setTimeout(() => {
        try {
          if (player && typeof player.getPlayerState === 'function') {
            const state = player.getPlayerState();
            if (state !== window.YT.PlayerState.PLAYING && state !== window.YT.PlayerState.BUFFERING) {
              player.mute();
              onMuteChange(true);
              player.playVideo();
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }, 600);

      return () => {
        clearTimeout(playTimeout);
        clearTimeout(checkPlayback);
      };
    } else {
      // STOP immediately when not visible
      try {
        player.pauseVideo();
      } catch (e) {
        // Ignore errors
      }
    }
  }, [isVisible, isReady, onMuteChange]);

  // Handle mute changes separately (only when visible and playing)
  useEffect(() => {
    if (!playerRef.current || !isReady || !isVisible) return;

    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch (e) {
      // Ignore errors
    }
  }, [isMuted, isReady, isVisible]);

  const handleClick = useCallback(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer"
      onClick={handleClick}
    >
      {/* YouTube Player Container */}
      <div id={playerId.current} className="w-full h-full" />

      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Paused indicator */}
      {!isPlaying && isReady && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

ReelVideoPlayer.displayName = 'ReelVideoPlayer';
