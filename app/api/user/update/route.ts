import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, profilePicture } = body;

    const updateData: any = {};

    // Validate and update username
    if (username !== undefined) {
      const trimmedUsername = username.trim();

      // Validate username format
      if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
        return NextResponse.json(
          { error: 'Username must be between 3 and 20 characters' },
          { status: 400 }
        );
      }

      // Check if username contains only valid characters
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, underscores, and hyphens' },
          { status: 400 }
        );
      }

      // Check if username is already taken
      const existing = await prisma.user.findUnique({
        where: { username: trimmedUsername },
      });

      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: `Username "${trimmedUsername}" is already taken. How about ${trimmedUsername}_${Math.floor(Math.random() * 999)}?` },
          { status: 409 }
        );
      }

      updateData.username = trimmedUsername;
    }

    // Update profile picture URL
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
