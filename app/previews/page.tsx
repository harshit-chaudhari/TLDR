'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReelsFeed } from '@/components/reels/ReelsFeed';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export default function PreviewsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAvatarClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#0a0a0a] overflow-hidden">
      {/* Header - plain dark background */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        {/* Header content */}
        <div className="px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d] uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              TLDR
            </span>
          </Link>

          {/* Keyboard shortcuts hint - desktop only (center) */}
          <div className="hidden md:flex items-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Space</kbd>
              play/pause
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">M</kbd>
              mute
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">L</kbd>
              like
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">S</kbd>
              share
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd>
              details
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">F</kbd>
              fullscreen
            </span>
          </div>

          {/* Profile Avatar (right) */}
          <div className="flex items-center">
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <button
                onClick={handleAvatarClick}
                className="flex items-center group hover:opacity-80 transition-opacity"
              >
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#e69d2e] to-[#a46e1d] p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
                    {user.profilePicture || user.image ? (
                      <Image
                        src={user.profilePicture || user.image || ''}
                        alt={user.name || 'User'}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-[#e69d2e] font-bold text-sm">
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                aria-label="Sign in"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <ReelsFeed onAuthRequired={() => setShowAuthModal(true)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        reason="favorite-action"
      />
    </div>
  );
}
