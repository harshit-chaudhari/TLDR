const TMDB_API_KEY = '7533aebdff300c70835b25be1e2268fd';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTMzYWViZGZmMzAwYzcwODM1YjI1YmUxZTIyNjhmZCIsIm5iZiI6MTc2MzQ1OTE5NC4wNjcwMDAyLCJzdWIiOiI2OTFjNDA3YTQxMTZkZGZiYzg2ZDk5ZTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0tSkocbqygvXP1jeQJtuOGBzJcqQZT-YgmmB74KwYC0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

const headers = {
  'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

// Platform ID mapping (TMDB watch provider IDs)
const platformIds: Record<string, number> = {
  'JioHotstar': 458, // JioCinema
  'NETFLIX': 8,
  'prime video': 119,
  'Disney+': 337,
  'hoichoi': 315,
  'Apple TV': 350,
  'Zee5': 232,
  'SonyLIV': 237,
  'Lionsgate Play': 546,
  'MX Player': 515,
  'Sun NXT': 309,
};

// Get trending movies/shows (for Top 10)
export async function getTrending(mediaType: 'movie' | 'tv', timeWindow: 'day' | 'week' = 'week') {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results.slice(0, 10);
}

// Get trending by platform and week
export async function getTrendingByPlatformAndWeek(
  mediaType: 'movie' | 'tv',
  platform: string,
  weekStart: Date
) {
  const providerId = platformIds[platform];

  try {
    // Fetch multiple pages to get more results
    const pages = await Promise.all([1, 2, 3, 4, 5].map(async (page) => {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=IN${providerId ? `&with_watch_providers=${providerId}` : ''}`,
        { headers }
      );
      const data = await response.json();
      return data.results || [];
    }));

    const results = pages.flat().slice(0, 20);

    // If no results with provider filter, fall back to general trending
    if (results.length === 0) {
      return getTrending(mediaType, 'week');
    }

    return results;
  } catch (error) {
    console.error(`Error fetching trending for ${platform}:`, error);
    return getTrending(mediaType, 'week');
  }
}

// Get popular movies/shows (for Just In)
export async function getPopular(mediaType: 'movie' | 'tv') {
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/popular?language=en-US&page=1`,
    { headers }
  );
  const data = await response.json();
  return data.results.slice(0, 20);
}

// Get popular by platform and date range
export async function getPopularByPlatformAndDate(
  mediaType: 'movie' | 'tv',
  platform: string,
  durationFilter: 'This Week' | 'Last Week' | 'This Month'
) {
  const providerId = platformIds[platform];
  console.log(`[Just In] Platform: ${platform}, Provider ID: ${providerId}, Filter: ${durationFilter}`);

  try {
    // Calculate date range - make it more flexible for providers with limited data
    const today = new Date();
    let startDate: Date;
    let endDate = new Date(today);

    // Use wider date ranges for better results
    if (durationFilter === 'This Week') {
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days instead of 7
    } else if (durationFilter === 'Last Week') {
      startDate = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000); // Last 60 days
      endDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000); // Last 90 days
    }

    const releaseDateKey = mediaType === 'movie' ? 'primary_release_date' : 'first_air_date';
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    console.log(`[Just In] Date range: ${startDateStr} to ${endDateStr}`);

    // First try: with provider and date filter
    const pages = await Promise.all([1, 2, 3, 4, 5].map(async (page) => {
      const url = `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=IN${providerId ? `&with_watch_providers=${providerId}` : ''}&${releaseDateKey}.gte=${startDateStr}&${releaseDateKey}.lte=${endDateStr}`;
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (page === 1) console.log(`[Just In] First page results:`, data.results?.length || 0);
      return data.results || [];
    }));

    const results = pages.flat().slice(0, 30);
    console.log(`[Just In] Total results with date filter: ${results.length}`);

    // If no results with provider and date filter, try without date filter
    if (results.length === 0 && providerId) {
      console.log(`[Just In] Trying without date filter...`);
      const fallbackPages = await Promise.all([1, 2, 3].map(async (page) => {
        const url = `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=IN&with_watch_providers=${providerId}`;
        const response = await fetch(url, { headers });
        const data = await response.json();
        return data.results || [];
      }));
      const fallbackResults = fallbackPages.flat().slice(0, 30);
      console.log(`[Just In] Fallback results: ${fallbackResults.length}`);
      return fallbackResults;
    }

    // Final fallback to general popular
    if (results.length === 0) {
      console.log(`[Just In] Using general popular as final fallback`);
      return getPopular(mediaType);
    }

    return results;
  } catch (error) {
    console.error(`[Just In] Error for ${platform}:`, error);
    return getPopular(mediaType);
  }
}

// Get upcoming movies or on-air shows (for Upcoming)
export async function getUpcoming(mediaType: 'movie' | 'tv') {
  const endpoint = mediaType === 'movie' ? 'upcoming' : 'on_the_air';
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${endpoint}?language=en-US&page=1`,
    { headers }
  );
  const data = await response.json();
  return data.results.slice(0, 20);
}

// Get upcoming by platform and date range
export async function getUpcomingByPlatformAndDate(
  mediaType: 'movie' | 'tv',
  platform: string,
  durationFilter: 'This Week' | 'Next Week' | 'This Month'
) {
  const providerId = platformIds[platform];
  console.log(`[Upcoming] Platform: ${platform}, Provider ID: ${providerId}, Filter: ${durationFilter}`);

  try {
    // Calculate date range - make it more flexible
    const today = new Date();
    let startDate = new Date(today);
    let endDate: Date;

    // Use wider date ranges for better results
    if (durationFilter === 'This Week') {
      endDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // Next 60 days instead of 7
    } else if (durationFilter === 'Next Week') {
      startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); // Next 90 days
    } else {
      endDate = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000); // Next 120 days
    }

    const releaseDateKey = mediaType === 'movie' ? 'primary_release_date' : 'first_air_date';
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    console.log(`[Upcoming] Date range: ${startDateStr} to ${endDateStr}`);

    // First try: with provider and date filter
    const pages = await Promise.all([1, 2, 3, 4, 5].map(async (page) => {
      const url = `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=IN${providerId ? `&with_watch_providers=${providerId}` : ''}&${releaseDateKey}.gte=${startDateStr}&${releaseDateKey}.lte=${endDateStr}`;
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (page === 1) console.log(`[Upcoming] First page results:`, data.results?.length || 0);
      return data.results || [];
    }));

    const results = pages.flat().slice(0, 30);
    console.log(`[Upcoming] Total results with date filter: ${results.length}`);

    // If no results with provider and date filter, try without date filter
    if (results.length === 0 && providerId) {
      console.log(`[Upcoming] Trying without date filter...`);
      const fallbackPages = await Promise.all([1, 2, 3].map(async (page) => {
        const url = `${TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=IN&with_watch_providers=${providerId}`;
        const response = await fetch(url, { headers });
        const data = await response.json();
        return data.results || [];
      }));
      const fallbackResults = fallbackPages.flat().slice(0, 30);
      console.log(`[Upcoming] Fallback results: ${fallbackResults.length}`);
      return fallbackResults;
    }

    // Final fallback to general upcoming
    if (results.length === 0) {
      console.log(`[Upcoming] Using general upcoming as final fallback`);
      return getUpcoming(mediaType);
    }

    return results;
  } catch (error) {
    console.error(`[Upcoming] Error for ${platform}:`, error);
    return getUpcoming(mediaType);
  }
}

// Get movie/show details
export async function getDetails(mediaType: 'movie' | 'tv', id: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${id}?language=en-US`,
    { headers }
  );
  return response.json();
}

// Get videos (trailers)
export async function getVideos(mediaType: 'movie' | 'tv', id: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${id}/videos?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results;
}

// Helper to get poster URL
export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') {
  if (!path) return '/placeholder.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Helper to get backdrop URL
export function getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!path) return '/placeholder.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Get watch providers
export async function getWatchProviders(mediaType: 'movie' | 'tv', id: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${id}/watch/providers`,
    { headers }
  );
  const data = await response.json();
  return data.results;
}

// Get credits (cast & crew)
export async function getCredits(mediaType: 'movie' | 'tv', id: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${id}/credits?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data;
}

// Genre truncation helper per PRD rules
// - Max 3 genres
// - Each truncated after 10 characters
// - One-word genres only (skip multi-word)
export function truncateGenres(genres: { id: number; name: string }[]): { id: number; name: string }[] {
  return genres
    .filter(genre => !genre.name.includes(' ')) // One-word only
    .slice(0, 3) // Max 3 genres
    .map(genre => ({
      ...genre,
      name: genre.name.length > 10 ? genre.name.slice(0, 10) : genre.name
    }));
}

// Platform deeplink mapping (placeholder URLs - would need actual deeplinks from platforms)
export function getPlatformDeeplink(platform: string, mediaType: 'movie' | 'tv', tmdbId: number, title: string) {
  const encodedTitle = encodeURIComponent(title);

  const deeplinks: Record<string, string> = {
    'Netflix': `https://www.netflix.com/search?q=${encodedTitle}`,
    'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`,
    'Disney Plus': `https://www.disneyplus.com/search?q=${encodedTitle}`,
    'Hotstar': `https://www.hotstar.com/in/search?q=${encodedTitle}`,
    'JioHotstar': `https://www.jiocinema.com/search?q=${encodedTitle}`,
    'Apple TV': `https://tv.apple.com/search?term=${encodedTitle}`,
    'Zee5': `https://www.zee5.com/search?q=${encodedTitle}`,
    'SonyLIV': `https://www.sonyliv.com/search?q=${encodedTitle}`,
    'Lionsgate Play': `https://www.lionsgateplay.com/search?q=${encodedTitle}`,
    'MX Player': `https://www.mxplayer.in/search?q=${encodedTitle}`,
    'Sun NXT': `https://www.sunnxt.com/search?q=${encodedTitle}`,
  };

  return deeplinks[platform] || `https://www.google.com/search?q=${encodedTitle}+where+to+watch`;
}
