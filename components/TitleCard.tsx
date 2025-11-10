'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Content } from '@/data/content';
import TLDRRating from './TLDRRating';

interface TitleCardProps {
  content: Content;
  rank?: number;
  onTrailerClick: (content: Content) => void;
}

const PlatformLogos = {
  'Netflix': () => (
    <svg viewBox="0 0 111 30" className="w-8 h-4">
      <path fill="currentColor" d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C78.6186138,26.4179976 75.3009245,25.9928862 72.0441681,25.5657514 L72.0441681,-5.68434189e-14 L76.6375777,-5.68434189e-14 L76.6375777,22.2499766 L81.9055207,23.2986886 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9582194 C59.4313866,26.0245203 61.0185516,26.0908212 62.6057166,26.1571221 L62.6057166,15.3435186 L68.3126943,15.3435186 L68.3126943,28.0693296 C65.8517742,28.1356305 63.3597536,28.2019314 60.9280341,28.2682323 L60.9280341,10.6561065 L64.2496954,10.6561065 Z M53.5136661,9.96895879 L53.5136661,28.785908 C51.6488882,28.785908 49.7841103,28.785908 47.9193324,28.785908 L47.9193324,9.96895879 L41.5741397,9.96895879 L41.5741397,6.09100112 L59.9430671,6.09100112 L59.9430671,9.96895879 L53.5136661,9.96895879 Z M37.1764719,27.6539144 C35.3435429,27.4345816 33.4797305,27.277223 31.6460276,27.0586361 L31.6460276,0 L36.2414555,0 L36.2414555,27.6539144 L37.1764719,27.6539144 Z M27.1452578,25.8469571 C25.3127288,25.6895017 23.4802998,25.5320463 21.6169878,25.4364673 L21.6169878,0 L26.2124157,0 L26.2124157,25.8469571 L27.1452578,25.8469571 Z M16.2431861,24.7638046 C14.4106572,24.7019416 12.5781282,24.6400787 10.7456003,24.5782157 L10.7456003,0 L15.3410281,0 L15.3410281,24.7638046 L16.2431861,24.7638046 Z M4.21026597,23.2336926 C2.90468949,23.2336926 1.59911301,23.2026928 0.293536541,23.1406931 L0.293536541,0 L4.88896439,0 L4.88896439,23.2336926 L4.21026597,23.2336926 Z"/>
    </svg>
  ),
  'Prime Video': () => (
    <svg viewBox="0 0 120 30" className="w-10 h-4">
      <path fill="currentColor" d="M15.7182 21.8557C11.0034 25.3042 4.32831 27.1255 -0.726806 27.2498C-1.85797 27.2807 -2.36353 26.0173 -1.54323 25.3351C3.1716 21.4803 9.44142 19.2538 15.7182 19.9668C15.7182 20.5978 15.7182 21.2288 15.7182 21.8557ZM18.0293 19.0982C17.8188 18.7046 15.4252 19.0177 14.2837 19.1421C13.9472 19.1832 13.8935 18.8701 14.1988 18.6531C16.0739 17.3279 18.9922 17.7215 19.3804 18.2077C19.7686 18.694 19.2837 21.5939 17.5334 23.0644C17.2488 23.3055 16.9847 23.1811 17.1127 22.8577C17.5745 21.6663 18.2398 19.4918 18.0293 19.0982Z"/>
    </svg>
  ),
  'Disney+': () => (
    <svg viewBox="0 0 120 30" className="w-10 h-4">
      <path fill="currentColor" d="M18.08,24.08c-1.48,0-2.68-1.2-2.68-2.68v-9.14c0-1.48,1.2-2.68,2.68-2.68h4.82c1.48,0,2.68,1.2,2.68,2.68v9.14c0,1.48-1.2,2.68-2.68,2.68H18.08z"/>
    </svg>
  ),
  'HBO Max': () => (
    <svg viewBox="0 0 120 30" className="w-10 h-4">
      <path fill="currentColor" d="M7.042,16.896H4.414v-3.754H2.893v3.754H0.273V8.008h2.62v3.518h1.521V8.008h2.628V16.896z M13.008,16.896  h-2.271l-1.244-3.048h-0.137v3.048H7.487V8.008h2.82c1.352,0,2.354,0.694,2.354,2.138c0,1.005-0.544,1.626-1.352,1.897  l1.734,4.853H13.008z"/>
    </svg>
  ),
  'Apple TV+': () => (
    <svg viewBox="0 0 120 30" className="w-10 h-4">
      <path fill="currentColor" d="M18.71,19.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Zm0-2.82c-.73,0-1.32.59-1.32,1.32s.59,1.32,1.32,1.32,1.32-.59,1.32-1.32-.59-1.32-1.32-1.32Z"/>
    </svg>
  ),
  'Hulu': () => (
    <svg viewBox="0 0 120 30" className="w-8 h-4">
      <path fill="currentColor" d="M14.706,11.695c0-1.37,0.874-2.244,2.244-2.244h4.046v7.612c0,1.37-0.874,2.244-2.244,2.244h-4.046V11.695z"/>
    </svg>
  ),
};

export default function TitleCard({ content, rank, onTrailerClick }: TitleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Logo = PlatformLogos[content.platform];

  const handlePlayClick = () => {
    window.open(content.watchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-black transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rank Badge - Only show for Top 10 */}
      {rank && (
        <div className="absolute top-0 left-0 z-30 bg-tldr-gold text-black font-bold text-2xl px-3 py-1 rounded-br-2xl">
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

        {/* Platform Logo - Always Visible at bottom */}
        <div className="absolute bottom-2 right-2 z-20 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="text-white opacity-80">
            <Logo />
          </div>
        </div>

        {/* Gradient overlay for hover content */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Hover Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 z-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Title and Rating */}
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">
            {content.title}
          </h3>
          <div className="flex items-center gap-2">
            <TLDRRating rating={content.tldrRating} size="sm" showLabel={false} />
            <span className="text-xs text-gray-400">
              {content.year}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePlayClick}
            className="flex-1 bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-tldr-gold transition-all duration-200 text-sm flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Play
          </button>

          <button
            onClick={() => onTrailerClick(content)}
            className="bg-tldr-darkGray/80 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-lg hover:bg-tldr-gray transition-all duration-200 text-sm"
            aria-label="Watch trailer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </button>
        </div>
      </div>
    </div>
  );
}
