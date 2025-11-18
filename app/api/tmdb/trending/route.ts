import { NextRequest, NextResponse } from 'next/server';
import { getPopularMovies, getPopularTVShows } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const data = type === 'movie'
      ? await getPopularMovies(page)
      : await getPopularTVShows(page);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    );
  }
}
