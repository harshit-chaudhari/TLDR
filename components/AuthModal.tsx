'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'welcome' | 'favorite-action';
}

export function AuthModal({ isOpen, onClose, reason = 'welcome' }: AuthModalProps) {
  const { signIn } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    await signIn();
    onClose(); // Close modal after signing in
  };

  const messages = {
    welcome: {
      title: 'Welcome to TLDR!',
      description: 'Sign in to save your favorite movies and shows across all platforms. Your personalized watchlist awaits.',
    },
    'favorite-action': {
      title: 'Sign in to save favorites',
      description: 'Create an account to save your favorite titles and access them from any device.',
    },
  };

  const message = messages[reason];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center space-y-6">
            {/* TLDR Logo/Title */}
            <div>
              <h1
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d] uppercase mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                TLDR
              </h1>
              <p className="text-sm text-white/40">What to watch? Made simple.</p>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">{message.title}</h2>
              <p className="text-white/70 leading-relaxed">{message.description}</p>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Maybe Later Button (for welcome only) */}
            {reason === 'welcome' && (
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
