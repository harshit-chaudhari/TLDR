'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDetails, getVideos, getBackdropUrl, getPosterUrl, getWatchProviders, getPlatformDeeplink, getCredits, truncateGenres, TMDBMovie, TMDBShow } from '@/lib/tmdb';
import { PlatformLogo } from './PlatformLogo';

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  tagline?: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface DetailsOverlayProps {
  items: (TMDBMovie | TMDBShow)[];
  initialIndex: number;
  mediaType: 'movie' | 'tv';
  onClose: () => void;
}

export default function DetailsOverlay({ items, initialIndex, mediaType, onClose }: DetailsOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullCast, setShowFullCast] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const currentItem = items[currentIndex];
  const id = currentItem?.id;
  const prevItem = items[currentIndex - 1];
  const nextItem = items[currentIndex + 1];

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      // Start transition immediately
      setIsTransitioning(true);

      // Small delay before loading new content so slide out is visible
      await new Promise(resolve => setTimeout(resolve, 300));

      setLoading(true);

      try {
        const [detailsData, videosData, providersData, creditsData] = await Promise.all([
          getDetails(mediaType, id),
          getVideos(mediaType, id),
          getWatchProviders(mediaType, id),
          getCredits(mediaType, id),
        ]);

        setDetails(detailsData);
        setVideos(videosData);
        setWatchProviders(providersData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
        // Natural slide in - smooth transition with overlap
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 50);
      }
    }
    fetchDetails();
    setShowFullCast(false);

    // Reset scroll position
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [mediaType, id]);

  // Handle scroll for expand/collapse
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const currentScrollY = scrollRef.current.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsExpanded(true);
      } else if (currentScrollY === 0) {
        setIsExpanded(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSlideDirection('right');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setSlideDirection('left');
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!details || loading) {
    return (
      <>
        {/* Overlay Background - More prominent overlay effect */}
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl" onClick={onClose} />

        {/* Loading Skeleton */}
        <div className="fixed z-[52] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1280px] h-[720px] rounded-lg overflow-hidden bg-black">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white text-xl transition-colors"
          >
            ✕
          </button>

          {/* Loading shimmer */}
          <div className="flex h-full">
            {/* Left poster skeleton */}
            <div className="w-[360px] h-full bg-[#0a0a0a] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
            {/* Right content skeleton */}
            <div className="flex-1 bg-black p-12">
              <div className="h-10 bg-[#1a1a1a] rounded w-2/3 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-[#1a1a1a] rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const title = details.title || details.name || 'Untitled';
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : 'N/A';

  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : '';

  const trailer = videos.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.find((v) => v.site === 'YouTube');

  const providers = watchProviders?.IN || watchProviders?.US;
  const primaryProvider = providers?.flatrate?.[0] || providers?.rent?.[0] || providers?.buy?.[0];

  const handleWatchClick = () => {
    if (primaryProvider) {
      const deeplink = getPlatformDeeplink(primaryProvider.provider_name, mediaType, id, title);
      window.open(deeplink, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+where+to+watch`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <>
      {/* Overlay Background - More prominent overlay effect */}
      <div
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Side Preview Cards - Hidden during transitions for clean Apple-style effect */}
      {!isTransitioning && (
        <>
          {/* Left Preview */}
          {prevItem && !isExpanded && (
            <div
              className="fixed left-[calc(50%-720px)] top-1/2 -translate-y-1/2 z-[51] w-[280px] h-[420px] opacity-60 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
              onClick={handlePrevious}
            >
              <Image
                src={getPosterUrl(prevItem.poster_path, 'w500')}
                alt={'title' in prevItem ? prevItem.title : prevItem.name}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 rounded-lg" />
            </div>
          )}

          {/* Right Preview */}
          {nextItem && !isExpanded && (
            <div
              className="fixed right-[calc(50%-720px)] top-1/2 -translate-y-1/2 z-[51] w-[280px] h-[420px] opacity-60 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
              onClick={handleNext}
            >
              <Image
                src={getPosterUrl(nextItem.poster_path, 'w500')}
                alt={'title' in nextItem ? nextItem.title : nextItem.name}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50 rounded-lg" />
            </div>
          )}
        </>
      )}

      {/* Main Overlay Container */}
      <div
        ref={overlayRef}
        className={`fixed z-[52] bg-black transition-all ${
          isExpanded ? 'inset-0' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1280px] h-[720px] rounded-lg overflow-hidden shadow-2xl'
        }`}
        style={{
          transform: isTransitioning
            ? `translate(-50%, -50%) translateX(${slideDirection === 'left' ? '-100%' : slideDirection === 'right' ? '100%' : '0'})`
            : isExpanded
            ? 'none'
            : 'translate(-50%, -50%)',
          opacity: isTransitioning ? 0 : 1,
          transitionProperty: 'transform, opacity',
          transitionDuration: '500ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white text-xl transition-colors"
        >
          ✕
        </button>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scrollable Content - Horizontal Layout */}
        <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <div className="flex h-full min-h-[720px]">
            {/* Left Side - Poster */}
            <div className="relative w-[480px] flex-shrink-0">
              <Image
                src={getPosterUrl(details.poster_path, 'original')}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark gradient overlay on poster */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black" />
            </div>

            {/* Right Side - Content with backdrop */}
            <div className="flex-1 relative">
              {/* Backdrop Image */}
              <div className="absolute inset-0">
                <Image
                  src={getBackdropUrl(details.backdrop_path, 'original')}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-12 h-full overflow-y-auto">
                {/* Title and Meta */}
                <div className="mb-8">
                  <h1 className="text-5xl font-bold leading-tight mb-6 text-white">{title}</h1>

                  <div className="flex items-center gap-6 text-lg mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="font-semibold text-white">{details.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-[#d4af37] font-bold">{releaseYear}</span>
                    {runtime && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">{runtime}</span>
                      </>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex gap-3 mb-8">
                    {truncateGenres(details.genres).map((genre) => (
                      <span
                        key={genre.id}
                        className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium border border-white/20 text-white backdrop-blur-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Overview */}
                  <p className="text-gray-200 leading-relaxed text-base max-w-2xl">
                    {details.overview}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-12">
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all flex items-center gap-3 border border-white/20 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-base tracking-wide">Play Trailer</span>
                    </button>
                  )}
                  <button
                    onClick={handleWatchClick}
                    className="px-8 py-4 bg-[#d4af37] hover:bg-[#c49f2f] text-black font-bold rounded-lg transition-all flex items-center gap-3"
                  >
                    <span className="text-base tracking-wide">Watch on</span>
                    {primaryProvider && (
                      <>
                        <span className="text-base tracking-wide">{primaryProvider.provider_name}</span>
                        <div className="flex items-center">
                          <PlatformLogo platform={primaryProvider.provider_name} isSelected={true} size="badge" />
                        </div>
                      </>
                    )}
                  </button>
                </div>

                {/* Cast Section */}
                {credits && credits.cast && credits.cast.length > 0 && (
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="text-2xl font-semibold mb-6 text-white">Cast</h3>

                    <div className="grid grid-cols-4 gap-6">
                      {(showFullCast ? credits.cast : credits.cast.slice(0, 8)).map((person: any) => (
                        <div key={person.id} className="text-center">
                          {person.profile_path ? (
                            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-3">
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                alt={person.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-[2/3] rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                              <span className="text-gray-500 text-4xl">{person.name.charAt(0)}</span>
                            </div>
                          )}
                          <p className="text-sm font-medium mb-1 text-white">{person.name}</p>
                          <p className="text-xs text-gray-400">{person.character}</p>
                        </div>
                      ))}
                    </div>

                    {credits.cast.length > 8 && (
                      <button
                        onClick={() => setShowFullCast(!showFullCast)}
                        className="mt-6 text-[#d4af37] hover:text-[#c49f2f] text-sm font-medium"
                      >
                        {showFullCast ? 'Show Less' : `Show All ${credits.cast.length} Cast Members`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-[90vw] max-w-[1400px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-14 right-0 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
