import {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVShowDetails,
  TMDBCredits,
  TMDBVideosResponse,
  TMDBSearchResponse,
  TMDBWatchProvidersResponse,
  TMDBPosterSize,
  TMDBBackdropSize,
  TMDBProfileSize,
} from '@/types/tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in environment variables');
}

/**
 * Build TMDB API URL with query parameters
 */
function buildUrl(endpoint: string, params: Record<string, string> = {}): string {
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY!);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}

/**
 * Fetch data from TMDB API
 */
async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

// ===== MOVIES =====

/**
 * Get popular movies
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return fetchTMDB<TMDBSearchResponse<TMDBMovie>>('/movie/popular', { page: page.toString() });
}

/**
 * Get top rated movies
 */
export async function getTopRatedMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return fetchTMDB<TMDBSearchResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() });
}

/**
 * Get now playing movies
 */
export async function getNowPlayingMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return fetchTMDB<TMDBSearchResponse<TMDBMovie>>('/movie/now_playing', { page: page.toString() });
}

/**
 * Get upcoming movies
 */
export async function getUpcomingMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return fetchTMDB<TMDBSearchResponse<TMDBMovie>>('/movie/upcoming', { page: page.toString() });
}

/**
 * Get movie details
 */
export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return fetchTMDB<TMDBMovieDetails>(`/movie/${movieId}`);
}

/**
 * Get movie credits
 */
export async function getMovieCredits(movieId: number): Promise<TMDBCredits> {
  return fetchTMDB<TMDBCredits>(`/movie/${movieId}/credits`);
}

/**
 * Get movie videos (trailers, teasers, etc.)
 */
export async function getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
  return fetchTMDB<TMDBVideosResponse>(`/movie/${movieId}/videos`);
}

/**
 * Get movie watch providers
 */
export async function getMovieWatchProviders(movieId: number): Promise<TMDBWatchProvidersResponse> {
  return fetchTMDB<TMDBWatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
}

// ===== TV SHOWS =====

/**
 * Get popular TV shows
 */
export async function getPopularTVShows(page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return fetchTMDB<TMDBSearchResponse<TMDBTVShow>>('/tv/popular', { page: page.toString() });
}

/**
 * Get top rated TV shows
 */
export async function getTopRatedTVShows(page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return fetchTMDB<TMDBSearchResponse<TMDBTVShow>>('/tv/top_rated', { page: page.toString() });
}

/**
 * Get airing today TV shows
 */
export async function getAiringTodayTVShows(page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return fetchTMDB<TMDBSearchResponse<TMDBTVShow>>('/tv/airing_today', { page: page.toString() });
}

/**
 * Get on the air TV shows
 */
export async function getOnTheAirTVShows(page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return fetchTMDB<TMDBSearchResponse<TMDBTVShow>>('/tv/on_the_air', { page: page.toString() });
}

/**
 * Get TV show details
 */
export async function getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
  return fetchTMDB<TMDBTVShowDetails>(`/tv/${tvId}`);
}

/**
 * Get TV show credits
 */
export async function getTVShowCredits(tvId: number): Promise<TMDBCredits> {
  return fetchTMDB<TMDBCredits>(`/tv/${tvId}/credits`);
}

/**
 * Get TV show videos
 */
export async function getTVShowVideos(tvId: number): Promise<TMDBVideosResponse> {
  return fetchTMDB<TMDBVideosResponse>(`/tv/${tvId}/videos`);
}

/**
 * Get TV show watch providers
 */
export async function getTVShowWatchProviders(tvId: number): Promise<TMDBWatchProvidersResponse> {
  return fetchTMDB<TMDBWatchProvidersResponse>(`/tv/${tvId}/watch/providers`);
}

// ===== SEARCH =====

/**
 * Search for movies
 */
export async function searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return fetchTMDB<TMDBSearchResponse<TMDBMovie>>('/search/movie', {
    query,
    page: page.toString(),
  });
}

/**
 * Search for TV shows
 */
export async function searchTVShows(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return fetchTMDB<TMDBSearchResponse<TMDBTVShow>>('/search/tv', {
    query,
    page: page.toString(),
  });
}

// ===== IMAGE URLs =====

/**
 * Get full poster URL
 */
export function getPosterUrl(path: string | null, size: TMDBPosterSize = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Get full backdrop URL
 */
export function getBackdropUrl(path: string | null, size: TMDBBackdropSize = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Get full profile URL
 */
export function getProfileUrl(path: string | null, size: TMDBProfileSize = 'w185'): string {
  if (!path) return '/placeholder-profile.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Get YouTube trailer URL from videos
 */
export function getTrailerUrl(videos: TMDBVideosResponse): string | null {
  const trailer = videos.results.find(
    (video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  if (!trailer) return null;
  return `https://www.youtube.com/watch?v=${trailer.key}`;
}
