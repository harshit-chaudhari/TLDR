'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'welcome' | 'favorite-action';
}

// Static poster paths for the grid display
const POSTER_GRID = [
  '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', // Skyfall
  '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', // Joker
  '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', // Shutter Island
  '/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg', // Oppenheimer
  '/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg', // Back to the Future
  '/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg', // The Godfather Part II
  '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', // Top Gun Maverick
  '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', // Superman
  '/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', // Split
  '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
  '/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg', // The Killer
  '/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg', // The Creator
  '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', // Interstellar
  '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', // Dune
  '/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', // Dark Knight
  '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers
  '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Batman
  '/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', // The Matrix
  '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', // Fight Club
  '/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg', // Pulp Fiction
];

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
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
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl w-full max-w-[880px] overflow-hidden shadow-2xl flex"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Left Side - Poster Grid */}
          <div className="hidden md:flex w-[420px] p-5 items-center">
            <div
              className="rounded-2xl overflow-hidden p-3 w-full"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="grid grid-cols-5 gap-1.5">
                {POSTER_GRID.map((poster, index) => (
                  <div
                    key={index}
                    className="aspect-[2/3] relative rounded-md overflow-hidden"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${poster}`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="75px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Content */}
          <div className="flex-1 p-10 lg:p-12 flex flex-col justify-center relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition-colors text-white/60 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="space-y-10">
              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-[32px] lg:text-[38px] font-semibold text-white leading-[1.15] tracking-tight">
                  Your entertainment,<br />organised.
                </h2>
                <p className="text-[#999] text-[15px] lg:text-base leading-relaxed max-w-[320px]">
                  Sign in to keep track of what you love and discover what&apos;s next, seamlessly across TLDR.
                </p>
              </div>

              {/* Sign In Button */}
              <button
                onClick={handleSignIn}
                className="w-full py-3.5 px-6 bg-[#3a3a3c] hover:bg-[#444446] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <span className="text-[15px]">Continue with Google</span>
              </button>

              {/* Terms */}
              <p className="text-[#666] text-[13px]">
                By continuing, you agree to our{' '}
                <span className="text-[#888] hover:text-white cursor-pointer transition-colors">Terms</span>
                {' & '}
                <span className="text-[#888] hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
