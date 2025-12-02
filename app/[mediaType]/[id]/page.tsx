'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getDetails, getVideos, getBackdropUrl, getPosterUrl, getWatchProviders, getPlatformDeeplink, truncateGenres } from '@/lib/tmdb';

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

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  const mediaType = params.mediaType as 'movie' | 'tv';
  const id = Number(params.id);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const [detailsData, videosData, providersData] = await Promise.all([
          getDetails(mediaType, id),
          getVideos(mediaType, id),
          getWatchProviders(mediaType, id),
        ]);
        setDetails(detailsData);
        setVideos(videosData);
        setWatchProviders(providersData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [mediaType, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Content not found</div>
      </div>
    );
  }

  const title = details.title || details.name || 'Untitled';
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : 'N/A';

  const trailer = videos.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.find((v) => v.site === 'YouTube');

  // Get primary watch provider (prefer IN region, fallback to US)
  const providers = watchProviders?.IN || watchProviders?.US;
  const primaryProvider = providers?.flatrate?.[0] || providers?.rent?.[0] || providers?.buy?.[0];

  const handleWatchClick = () => {
    if (primaryProvider) {
      const deeplink = getPlatformDeeplink(primaryProvider.provider_name, mediaType, id, title);
      window.open(deeplink, '_blank');
    } else {
      // Fallback to Google search
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+where+to+watch`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="h-[92px] bg-black border-b border-[#333] fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-16 flex items-center justify-between">
          <div className="w-[260px] flex items-center justify-center">
            <button onClick={() => router.push('/')}>
              <h1 className="text-[#d4af37] text-[35px] font-bold tracking-wider leading-none">TLDR</h1>
            </button>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[13px] tracking-[0.3em] text-gray-400 uppercase font-semibold">
              WHAT TO WATCH? MADE SIMPLE
            </p>
          </div>
          <div className="w-[260px] flex justify-end">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 border border-[#d4af37] rounded text-[#d4af37] text-sm font-medium hover:bg-[#d4af37] hover:text-black transition-all"
            >
              BACK
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Backdrop */}
      <section className="relative h-[80vh] mt-[92px]">
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(details.backdrop_path, 'original')}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative h-full max-w-[1440px] mx-auto px-16 flex items-end pb-16">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <div className="relative w-[300px] h-[450px] rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={getPosterUrl(details.poster_path, 'w500')}
                alt={title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <h1 className="text-5xl font-bold mb-4">{title}</h1>
              {details.tagline && (
                <p className="text-gray-400 italic mb-4">{details.tagline}</p>
              )}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <span className="text-[#d4af37] font-semibold">{releaseYear}</span>
                {details.runtime && <span>{details.runtime} min</span>}
                {details.number_of_seasons && (
                  <span>{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>{details.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {truncateGenres(details.genres).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                {details.overview}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleWatchClick}
                  className="px-8 py-3 bg-[#d4af37] text-black font-bold rounded hover:bg-[#c49f2f] transition-all"
                >
                  {primaryProvider ? `WATCH ON ${primaryProvider.provider_name.toUpperCase()}` : 'FIND WHERE TO WATCH'}
                </button>
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="px-8 py-3 border border-white/50 text-white font-bold rounded hover:bg-white/10 transition-all"
                  >
                    ▶ TRAILER
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-[90vw] max-w-[1200px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300"
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
    </div>
  );
}
