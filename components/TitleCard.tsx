'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Content } from '@/data/content';
import TLDRRating from './TLDRRating';
import PlatformBadge from './PlatformBadge';

interface TitleCardProps {
  content: Content;
  rank?: number;
  onTrailerClick: (content: Content) => void;
}

export default function TitleCard({ content, rank, onTrailerClick }: TitleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = () => {
    window.open(content.watchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-tldr-darkGray transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rank Badge - Only show for Top 10 */}
      {rank && (
        <div className="absolute top-0 left-0 z-20 bg-tldr-gold text-tldr-dark font-bold text-3xl px-4 py-2 rounded-br-lg">
          {rank}
        </div>
      )}

      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={content.poster}
          alt={content.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content Info - Always Visible */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 flex-1">
            {content.title}
          </h3>
        </div>
        <div className="flex items-center justify-between gap-2">
          <TLDRRating rating={content.tldrRating} size="sm" />
          <PlatformBadge platform={content.platform} />
        </div>
      </div>

      {/* Hover Overlay with Buttons */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-opacity duration-300 z-30 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <TLDRRating rating={content.tldrRating} size="lg" />

        <div className="flex flex-col gap-3 w-full px-6">
          {/* Play Button */}
          <button
            onClick={handlePlayClick}
            className="w-full bg-white text-tldr-dark font-bold py-3 px-6 rounded-lg hover:bg-tldr-gold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Play Now
          </button>

          {/* Trailer Button */}
          <button
            onClick={() => onTrailerClick(content)}
            className="w-full bg-tldr-gray text-white font-semibold py-3 px-6 rounded-lg hover:bg-tldr-lightGray transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
}
