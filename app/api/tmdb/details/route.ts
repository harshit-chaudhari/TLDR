import { NextRequest, NextResponse } from 'next/server';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getTVShowDetails,
  getTVShowCredits,
  getTVShowVideos,
} from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';

  if (!id) {
    return NextResponse.json(
      { error: 'Content ID is required' },
      { status: 400 }
    );
  }

  const contentId = parseInt(id);

  try {
    // Fetch details, credits, and videos in parallel
    const [details, credits, videos] = await Promise.all([
      type === 'movie'
        ? getMovieDetails(contentId)
        : getTVShowDetails(contentId),
      type === 'movie'
        ? getMovieCredits(contentId)
        : getTVShowCredits(contentId),
      type === 'movie'
        ? getMovieVideos(contentId)
        : getTVShowVideos(contentId),
    ]);

    return NextResponse.json(
      { details, credits, videos },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content details' },
      { status: 500 }
    );
  }
}
