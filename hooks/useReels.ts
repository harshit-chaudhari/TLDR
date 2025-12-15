'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function useReels(): UseReelsReturn {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReels = useCallback(async (pageNum: number) => {
    try {
      // Fetch mix of trending movies and TV shows
      const [trendingMovies, trendingTV, popularMovies, popularTV] = await Promise.all([
        getTrending('movie', 'week'),
        getTrending('tv', 'week'),
        getPopular('movie'),
        getPopular('tv'),
      ]);

      // Combine and shuffle content
      const allContent = [
        ...trendingMovies.map((m: any) => ({ ...m, mediaType: 'movie' as const })),
        ...trendingTV.map((t: any) => ({ ...t, mediaType: 'tv' as const })),
        ...popularMovies.slice(0, 10).map((m: any) => ({ ...m, mediaType: 'movie' as const })),
        ...popularTV.slice(0, 10).map((t: any) => ({ ...t, mediaType: 'tv' as const })),
      ];

      // Remove duplicates by ID
      const uniqueContent = allContent.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id && t.mediaType === item.mediaType)
      );

      // Shuffle array
      const shuffled = uniqueContent.sort(() => Math.random() - 0.5);

      // Paginate - 10 items per page
      const startIdx = (pageNum - 1) * 10;
      const pageContent = shuffled.slice(startIdx, startIdx + 10);

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
        setHasMore(reels.length >= 5);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [fetchReels]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newReels = await fetchReels(nextPage);

      if (newReels.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newReels]);
        setPage(nextPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, fetchReels]);

  return { items, isLoading, error, hasMore, loadMore };
}
