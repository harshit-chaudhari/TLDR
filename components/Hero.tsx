'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { top10Movies, top10Shows, newReleaseMovies, newReleaseShows } from '@/data/content';

export default function Hero() {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Combine all content for poster showcase
  const allContent = [...top10Movies, ...top10Shows, ...newReleaseMovies, ...newReleaseShows];
  const showcasePosters = allContent.slice(0, 20);

  // Auto-rotate featured poster
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % 8);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredContent = showcasePosters.slice(0, 8);
  const backgroundPosters = showcasePosters.slice(8, 20);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Layer - Ambient Posters */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-4 gap-8 p-8 opacity-10 blur-sm">
          {backgroundPosters.map((content) => (
            <div
              key={content.id}
              className="relative aspect-[2/3] rounded-2xl overflow-hidden"
            >
              <Image
                src={content.poster}
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Main Featured Posters - Cinematic Carousel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative w-full max-w-[90rem] h-full flex items-center justify-center px-4 sm:px-8">
          {/* Featured Posters Stack */}
          <div className="relative w-full h-[70vh] flex items-center justify-center">
            {featuredContent.map((content, index) => {
              const isActive = index === featuredIndex;
              const offset = index - featuredIndex;
              const absOffset = Math.abs(offset);

              return (
                <div
                  key={content.id}
                  className="absolute transition-all duration-1000 ease-out"
                  style={{
                    transform: `
                      translateX(${offset * 15}%)
                      translateZ(${isActive ? 0 : -absOffset * 100}px)
                      scale(${isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15)})
                      rotateY(${offset * 8}deg)
                    `,
                    opacity: absOffset > 2 ? 0 : isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.3),
                    zIndex: 10 - absOffset,
                    filter: isActive ? 'none' : `blur(${absOffset * 2}px)`,
                  }}
                >
                  <div className="relative w-[280px] sm:w-[340px] md:w-[400px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={content.poster}
                      alt={content.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 400px"
                      priority={index < 3}
                    />
                    {/* Subtle gradient overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-16 px-4 sm:px-6 lg:px-8 pointer-events-none">
        {/* Top Content */}
        <div className="w-full max-w-4xl text-center space-y-8 animate-fadeIn">
          {/* Logo/Brand */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight">
            <span
              className="bg-gradient-to-br from-tldr-gold via-yellow-400 to-tldr-gold bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              TLDR
            </span>
          </h1>

          {/* Tagline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              What to watch?
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-tldr-gold to-yellow-500 bg-clip-text text-transparent">
              Made simple.
            </p>
          </div>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Curated content. Every platform. Zero overwhelm.
          </p>
        </div>

        {/* Bottom Content */}
        <div className="flex flex-col items-center gap-8">
          {/* CTA Button */}
          <button
            onClick={scrollToContent}
            className="group pointer-events-auto relative inline-flex items-center gap-3 bg-white text-black font-semibold text-base sm:text-lg px-10 py-4 rounded-full hover:bg-tldr-gold transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Explore Content
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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

          {/* Scroll Indicator */}
          <div className="animate-bounce opacity-60">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setFeaturedIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === featuredIndex
                ? 'bg-tldr-gold w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to poster ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
