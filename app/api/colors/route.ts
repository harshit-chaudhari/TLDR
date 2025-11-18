import { NextRequest, NextResponse } from 'next/server';
import { extractColors } from '@/utils/colorExtractor';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Image URL is required' },
      { status: 400 }
    );
  }

  try {
    const colors = await extractColors(imageUrl);

    if (!colors) {
      return NextResponse.json(
        { error: 'Failed to extract colors' },
        { status: 500 }
      );
    }

    return NextResponse.json(colors, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Color extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
