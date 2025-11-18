import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingMovies, getOnTheAirTVShows } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'movie';
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const data = type === 'movie'
      ? await getUpcomingMovies(page)
      : await getOnTheAirTVShows(page);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming content' },
      { status: 500 }
    );
  }
}
