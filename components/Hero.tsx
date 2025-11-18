'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { top10Movies, top10Shows, newReleaseMovies, newReleaseShows, upcomingMovies, upcomingShows } from '@/data/content';

export default function Hero() {
  const [dominantColor, setDominantColor] = useState({ r: 45, g: 36, b: 22 }); // Warm gold default

  // Combine all content for infinite carousel
  const allContent = [
    ...top10Movies,
    ...top10Shows,
    ...newReleaseMovies,
    ...newReleaseShows,
    ...upcomingMovies,
    ...upcomingShows
  ];

  // Create multiple rows with different content
  const row1 = [...allContent.slice(0, 12), ...allContent.slice(0, 12)]; // Duplicate for infinite scroll
  const row2 = [...allContent.slice(12, 24), ...allContent.slice(12, 24)];
  const row3 = [...allContent.slice(6, 18), ...allContent.slice(6, 18)];
  const row4 = [...allContent.slice(18, 30), ...allContent.slice(18, 30)];

  const scrollToContent = () => {
    const contentSection = document.getElementById('platform-selection');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Dynamic gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center,
            rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.3) 0%,
            rgba(0, 0, 0, 1) 70%)`
        }}
      />

      {/* Infinite scrolling poster rows */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 opacity-20">
        {/* Row 1 - Scroll right */}
        <div className="flex gap-4 animate-scroll-right">
          {row1.map((content, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden"
            >
              <Image
                src={content.poster}
                alt=""
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Row 2 - Scroll left */}
        <div className="flex gap-4 animate-scroll-left">
          {row2.map((content, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden"
            >
              <Image
                src={content.poster}
                alt=""
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Row 3 - Scroll right faster */}
        <div className="flex gap-4 animate-scroll-right-fast">
          {row3.map((content, index) => (
            <div
              key={`row3-${index}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden"
            >
              <Image
                src={content.poster}
                alt=""
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Row 4 - Scroll left faster */}
        <div className="flex gap-4 animate-scroll-left-fast">
          {row4.map((content, index) => (
            <div
              key={`row4-${index}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden"
            >
              <Image
                src={content.poster}
                alt=""
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black z-10" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-4xl">
          {/* Logo */}
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold tracking-tight">
            <span
              className="bg-gradient-to-br from-tldr-gold via-yellow-400 to-tldr-gold bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              TLDR
            </span>
          </h1>

          {/* Tagline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
            Your streaming universe.
            <br />
            <span className="text-tldr-gold">Simplified.</span>
          </h2>

          {/* Stats - Showing abundance */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 text-white/80 text-sm sm:text-base pt-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-tldr-gold">{allContent.length}+</div>
              <div className="text-gray-400">Titles</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-tldr-gold">6</div>
              <div className="text-gray-400">Platforms</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-tldr-gold">∞</div>
              <div className="text-gray-400">Possibilities</div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToContent}
            className="mt-8 group inline-flex items-center gap-3 bg-tldr-gold text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Start Exploring
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-tldr-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 60s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }

        .animate-scroll-right-fast {
          animation: scroll-right 40s linear infinite;
        }

        .animate-scroll-left-fast {
          animation: scroll-left 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
