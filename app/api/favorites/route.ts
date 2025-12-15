import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all favorites for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// POST new favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tmdbId, mediaType, title, posterPath } = body;

    // Validate input
    if (!tmdbId || !mediaType || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: session.user.id,
          tmdbId: parseInt(tmdbId),
          mediaType,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 });
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        tmdbId: parseInt(tmdbId),
        mediaType,
        title,
        posterPath: posterPath || null,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 });
  }
}
