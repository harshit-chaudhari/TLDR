'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending, getPopular, getVideos, getWatchProviders, getDetails, getPlatformDeeplink } from '@/lib/tmdb';

export interface ReelItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  trailerKey: string;
  trailerName: string;
  platform: string | null;
  platformLogo: string | null;
  watchLink: string | null;
  voteAverage: number;
  releaseYear: number;
  overview: string;
  genres: string[];
  runtime: number | null;
}

interface UseReelsReturn {
  items: ReelItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

// TMDB API base URL and headers for direct API calls
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTMzYWViZGZmMzAwYzcwODM1YjI1YmUxZTIyNjhmZCIsIm5iZiI6MTc2MzQ1OTE5NC4wNjcwMDAyLCJzdWIiOiI2OTFjNDA3YTQxMTZkZGZiYzg2ZDk5ZTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0tSkocbqygvXP1jeQJtuOGBzJcqQZT-YgmmB74KwYC0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

// Fetch discover content with pagination for infinite scrolling
async function getDiscoverPage(mediaType: 'movie' | 'tv', page: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&vote_count.gte=100`,
    { headers }
  );
  const data = await response.json();
  return data.results || [];
}

export function useReels(): UseReelsReturn {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const seenIds = useRef<Set<string>>(new Set()); // Track seen content to avoid duplicates

  const fetchReels = useCallback(async (pageNum: number) => {
    try {
      // For first page, mix trending and popular for variety
      // For subsequent pages, use discover API with pagination for infinite content
      let allContent: any[] = [];

      if (pageNum === 1) {
        // Initial load: mix trending and popular
        const [trendingMovies, trendingTV, popularMovies, popularTV] = await Promise.all([
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getPopular('movie'),
          getPopular('tv'),
        ]);

        allContent = [
          ...trendingMovies.map((m: any) => ({ ...m, mediaType: 'movie' as const })),
          ...trendingTV.map((t: any) => ({ ...t, mediaType: 'tv' as const })),
          ...popularMovies.slice(0, 10).map((m: any) => ({ ...m, mediaType: 'movie' as const })),
          ...popularTV.slice(0, 10).map((t: any) => ({ ...t, mediaType: 'tv' as const })),
        ];
      } else {
        // Subsequent pages: use discover API for infinite content
        // TMDB discover API supports up to 500 pages
        const discoverPage = Math.ceil(pageNum / 2); // Spread across more TMDB pages
        const [discoverMovies, discoverTV] = await Promise.all([
          getDiscoverPage('movie', discoverPage),
          getDiscoverPage('tv', discoverPage),
        ]);

        allContent = [
          ...discoverMovies.map((m: any) => ({ ...m, mediaType: 'movie' as const })),
          ...discoverTV.map((t: any) => ({ ...t, mediaType: 'tv' as const })),
        ];
      }

      // Remove duplicates by ID (including previously seen items)
      const uniqueContent = allContent.filter((item) => {
        const key = `${item.mediaType}-${item.id}`;
        if (seenIds.current.has(key)) return false;
        seenIds.current.add(key);
        return true;
      });

      // Shuffle array for variety
      const shuffled = uniqueContent.sort(() => Math.random() - 0.5);

      // Take up to 10 items per fetch
      const pageContent = shuffled.slice(0, 10);

      // Fetch trailers for each item in parallel
      const reelsWithTrailers = await Promise.all(
        pageContent.map(async (item) => {
          try {
            const [videos, providers, details] = await Promise.all([
              getVideos(item.mediaType, item.id),
              getWatchProviders(item.mediaType, item.id),
              getDetails(item.mediaType, item.id),
            ]);

            // Find YouTube trailer - must have a valid key
            const trailer = videos?.find(
              (v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.key
            ) || videos?.find((v: any) => v.site === 'YouTube' && v.key);

            // Skip if no valid trailer found
            if (!trailer || !trailer.key || typeof trailer.key !== 'string') return null;

            // Get primary platform from India watch providers
            const inProviders = providers?.IN;
            const flatrate = inProviders?.flatrate?.[0];
            const buy = inProviders?.buy?.[0];
            const rent = inProviders?.rent?.[0];
            const primaryProvider = flatrate || buy || rent;

            // Get release year
            const dateStr = item.mediaType === 'movie'
              ? item.release_date
              : item.first_air_date;
            const releaseYear = dateStr ? new Date(dateStr).getFullYear() : 0;

            // Get title
            const title = item.mediaType === 'movie' ? item.title : item.name;

            // Get watch link
            const watchLink = primaryProvider
              ? getPlatformDeeplink(primaryProvider.provider_name, item.mediaType, item.id, title)
              : null;

            // Get genres
            const genres = details?.genres?.map((g: any) => g.name) || [];

            // Get runtime
            const runtime = item.mediaType === 'movie'
              ? details?.runtime || null
              : details?.episode_run_time?.[0] || null;

            return {
              id: item.id,
              mediaType: item.mediaType,
              title,
              posterPath: item.poster_path,
              backdropPath: item.backdrop_path,
              trailerKey: trailer.key,
              trailerName: trailer.name || 'Trailer',
              platform: primaryProvider?.provider_name || null,
              platformLogo: primaryProvider?.logo_path || null,
              watchLink,
              voteAverage: item.vote_average,
              releaseYear,
              overview: details?.overview || item.overview || '',
              genres,
              runtime,
            } as ReelItem;
          } catch {
            return null;
          }
        })
      );

      // Filter out items without valid trailers
      const validReels = reelsWithTrailers.filter((r): r is ReelItem =>
        r !== null &&
        typeof r.trailerKey === 'string' &&
        r.trailerKey.length > 0
      );

      return validReels;
    } catch (err) {
      throw new Error('Failed to fetch reels');
    }
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reels = await fetchReels(1);
        setItems(reels);
        // Always has more - infinite feed (TMDB discover API supports 500 pages)
        setHasMore(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [fetchReels]);

  const loadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newReels = await fetchReels(nextPage);

      if (newReels.length > 0) {
        setItems((prev) => [...prev, ...newReels]);
        setPage(nextPage);
      }
      // Keep hasMore true - infinite feed
      // TMDB discover API supports up to 500 pages per media type
      // That's 500 * 20 * 2 = 20,000 items theoretical max
      // We'll never realistically reach this limit
      setHasMore(nextPage < 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page, fetchReels]);

  return { items, isLoading, error, hasMore, loadMore };
}
