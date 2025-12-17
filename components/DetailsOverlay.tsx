'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDetails, getVideos, getBackdropUrl, getPosterUrl, getWatchProviders, getPlatformDeeplink, getCredits, truncateGenres, TMDBMovie, TMDBShow } from '@/lib/tmdb';
import { PlatformLogo } from './PlatformLogo';
import { FavoriteButton } from './FavoriteButton';
import toast from 'react-hot-toast';

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
  onAuthRequired?: () => void;
}

export default function DetailsOverlay({ items, initialIndex, mediaType, onClose, onAuthRequired }: DetailsOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const favoriteContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Layered animation states
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showGradient, setShowGradient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetailsSection] = useState(false);

  const currentItem = items[currentIndex];
  const id = currentItem?.id;
  // Use the current item's media_type if available, fall back to the prop
  const currentMediaType = (currentItem as any)?.media_type || mediaType;

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setLoading(true);

      try {
        const [detailsData, videosData, providersData, creditsData] = await Promise.all([
          getDetails(currentMediaType, id),
          getVideos(currentMediaType, id),
          getWatchProviders(currentMediaType, id),
          getCredits(currentMediaType, id),
        ]);

        setDetails(detailsData);
        setVideos(videosData);
        setWatchProviders(providersData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 50);
      }
    }
    fetchDetails();

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentMediaType, id]);

  // Layered entrance animation - triggered when details are loaded
  useEffect(() => {
    if (!details || loading) {
      // Reset all layers when loading
      setShowBackdrop(false);
      setShowGradient(false);
      setShowContent(false);
      setShowDetailsSection(false);
      return;
    }

    // Sequence the layers with deliberate timing
    const backdropTimer = setTimeout(() => setShowBackdrop(true), 100);
    const gradientTimer = setTimeout(() => setShowGradient(true), 400);
    const contentTimer = setTimeout(() => setShowContent(true), 600);
    const detailsTimer = setTimeout(() => setShowDetailsSection(true), 800);

    return () => {
      clearTimeout(backdropTimer);
      clearTimeout(gradientTimer);
      clearTimeout(contentTimer);
      clearTimeout(detailsTimer);
    };
  }, [details, loading]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        handleNext();
      } else if (e.key === 'Escape' || e.key === 'd' || e.key === 'D') {
        // Close on Escape or D (toggle behavior - D opens and closes)
        onClose();
      } else if (e.key === 'l' || e.key === 'L') {
        // Toggle favorite
        e.preventDefault();
        const button = favoriteContainerRef.current?.querySelector('button');
        button?.click();
      } else if (e.key === 's' || e.key === 'S') {
        // Share
        e.preventDefault();
        handleShare();
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

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go next
        handleNext();
      } else {
        // Swiped right - go previous
        handlePrevious();
      }
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!details || loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const title = details.title || details.name || 'Untitled';
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : null;

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
      const deeplink = getPlatformDeeplink(primaryProvider.provider_name, currentMediaType, id, title);
      window.open(deeplink, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+where+to+watch`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/reels?id=${id}&type=${currentMediaType}`;
    const shareData = {
      title: title,
      text: `Check out ${title} on TLDR`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      }
    } catch {
      // User cancelled share
    }
  };

  // Director/Creator
  const director = credits?.crew?.find((c: any) => c.job === 'Director');
  const creator = credits?.crew?.find((c: any) => c.job === 'Creator' || c.job === 'Executive Producer');

  return (
    <>
      {/* Overlay Background */}
      <div className="fixed inset-0 z-50 bg-black/90" onClick={onClose} />

      {/* Main Container - Full screen on mobile, centered modal on desktop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[52] lg:inset-8 lg:rounded-2xl overflow-hidden bg-[#0a0a0a]"
        style={{
          transform: isTransitioning
            ? `translateX(${slideDirection === 'left' ? '-30px' : slideDirection === 'right' ? '30px' : '0'})`
            : 'none',
          opacity: isTransitioning ? 0 : 1,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:top-6 lg:right-6 z-[60] w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows - Show when multiple items */}
        {items.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Position indicator - Mobile only */}
            <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1.5">
              {items.slice(Math.max(0, currentIndex - 2), Math.min(items.length, currentIndex + 3)).map((_, i) => {
                const actualIndex = Math.max(0, currentIndex - 2) + i;
                return (
                  <div
                    key={actualIndex}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      actualIndex === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                    }`}
                  />
                );
              })}
            </div>

            {/* Swipe hint - Mobile, shown briefly */}
            <div className="lg:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none z-[55]">
              {currentIndex > 0 && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              )}
              <div className="flex-1" />
              {currentIndex < items.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </>
        )}

        {/* Scrollable Content */}
        <div ref={scrollRef} className="h-full overflow-y-auto">
          {/* Hero Section - Backdrop focused */}
          <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
            {/* Backdrop Image - Layer 1 */}
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                opacity: showBackdrop ? 1 : 0,
                transform: showBackdrop ? 'scale(1)' : 'scale(1.05)',
              }}
            >
              <Image
                src={getBackdropUrl(details.backdrop_path, 'original')}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Gradient overlays - Layer 2 */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent transition-opacity duration-500 ease-out"
              style={{ opacity: showGradient ? 1 : 0 }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent transition-opacity duration-500 ease-out"
              style={{ opacity: showGradient ? 1 : 0 }}
            />

            {/* Content over backdrop - Layer 3 */}
            <div
              className="absolute bottom-0 left-0 right-0 p-6 lg:px-20 lg:pb-12 transition-all duration-500 ease-out"
              style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? 'translateY(0)' : 'translateY(30px)',
              }}
            >
              <div className="max-w-3xl">
                {/* Favorite & Share - Above title */}
                <div className="flex items-center gap-2 mb-6">
                  {/* Favorite Button */}
                  <div
                    ref={favoriteContainerRef}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <FavoriteButton
                      tmdbId={id}
                      mediaType={currentMediaType}
                      title={title}
                      posterPath={details.poster_path}
                      size="md"
                      onAuthRequired={onAuthRequired}
                    />
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    aria-label="Share"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {title}
                </h1>

                {/* Tagline */}
                {details.tagline && (
                  <p className="text-white/50 text-base lg:text-lg italic mb-4">
                    {details.tagline}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm lg:text-base mb-5">
                  {details.vote_average > 0 && (
                    <span className="flex items-center gap-1.5 text-[#e69d2e]">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{details.vote_average.toFixed(1)}</span>
                    </span>
                  )}
                  {releaseYear && (
                    <span className="text-white/70">{releaseYear}</span>
                  )}
                  {runtime && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-white/70">{runtime}</span>
                    </>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {truncateGenres(details.genres).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-xs lg:text-sm text-white/70 bg-white/10 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Play Trailer - Primary action */}
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-5 lg:px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Trailer</span>
                    </button>
                  )}

                  {/* Watch Button */}
                  {primaryProvider && (
                    <button
                      onClick={handleWatchClick}
                      className="flex items-center gap-2 px-5 lg:px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-medium rounded-lg transition-colors"
                    >
                      <PlatformLogo platform={primaryProvider.provider_name} isSelected={true} size="badge" logoPath={primaryProvider.logo_path} />
                      <span>Watch on {primaryProvider.provider_name}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section - Layer 4 */}
          <div
            className="px-6 lg:px-20 py-8 lg:py-10 space-y-10 transition-all duration-500 ease-out"
            style={{
              opacity: showDetails ? 1 : 0,
              transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {/* Overview */}
            {details.overview && (
              <div className="max-w-3xl">
                <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Synopsis</h3>
                <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                  {details.overview}
                </p>
              </div>
            )}

            {/* Info Grid - Director/Creator + Starring */}
            {((director || creator) || credits?.cast?.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
                {/* Director/Creator */}
                {(director || creator) && (
                  <div>
                    <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">
                      {currentMediaType === 'tv' ? 'Creator' : 'Director'}
                    </h4>
                    <p className="text-white text-base font-medium">
                      {director?.name || creator?.name}
                    </p>
                  </div>
                )}

                {/* Top Cast - inline */}
                {credits?.cast?.length > 0 && (
                  <div>
                    <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">Starring</h4>
                    <p className="text-white text-base font-medium">
                      {credits.cast.slice(0, 3).map((c: any) => c.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cast Section - Horizontal scroll */}
            {credits?.cast?.length > 0 && (
              <div>
                <h3 className="text-white/40 text-xs uppercase tracking-wider mb-4">Full Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:-mx-20 lg:px-20">
                  {credits.cast.slice(0, 12).map((person: any) => (
                    <div key={person.id} className="flex-shrink-0 w-24 lg:w-28">
                      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                        {person.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">
                            {person.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs lg:text-sm font-medium truncate">{person.name}</p>
                      <p className="text-white/50 text-xs truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More Providers */}
            {providers && (providers.flatrate?.length > 1 || providers.rent?.length > 0 || providers.buy?.length > 0) && (
              <div>
                <h3 className="text-white/40 text-xs uppercase tracking-wider mb-4">Available On</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.flatrate?.map((p: any) => (
                    <div
                      key={p.provider_id}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        width={24}
                        height={24}
                        className="rounded"
                      />
                      <span className="text-white/80 text-sm">{p.provider_name}</span>
                    </div>
                  ))}
                  {providers.rent?.slice(0, 3).map((p: any) => (
                    <div
                      key={p.provider_id}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        width={24}
                        height={24}
                        className="rounded"
                      />
                      <span className="text-white/80 text-sm">{p.provider_name}</span>
                      <span className="text-white/40 text-xs">Rent</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            className="relative w-[95vw] lg:w-[85vw] max-w-[1400px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
