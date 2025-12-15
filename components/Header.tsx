'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';

export function Header() {
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
    <>
      <header className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-lg border-b border-[#1a1a1a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* TLDR Logo */}
            <div className="flex items-center gap-8">
              <h1
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d] uppercase cursor-pointer"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                TLDR
              </h1>
            </div>

            {/* Center Title */}
            <div className="hidden md:block">
              <h2
                className="text-lg font-bold tracking-[8px] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.72)] via-[#ffffff] to-[rgba(255,255,255,0.8)]"
                style={{ fontFamily: "'Red Hat Display', sans-serif" }}
              >
                TOP TEN TRENDING TITLES
              </h2>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                <button
                  onClick={handleAvatarClick}
                  className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                >
                  {/* User Avatar */}
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#e69d2e] to-[#a46e1d] p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
                      {user.profilePicture || user.image ? (
                        <Image
                          src={user.profilePicture || user.image || ''}
                          alt={user.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[#e69d2e] font-bold text-lg">
                          {(user.name || user.email || 'U')[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  {user.username && (
                    <span className="hidden lg:block text-white font-medium">
                      {user.username}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[rgba(230,157,46,0.1)] to-[rgba(164,110,29,0.1)] border-2 border-[#e69d2e] rounded-full text-[#e69d2e] font-bold text-sm uppercase tracking-wider hover:from-[rgba(230,157,46,0.2)] hover:to-[rgba(164,110,29,0.2)] transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        reason="welcome"
      />
    </>
  );
}
