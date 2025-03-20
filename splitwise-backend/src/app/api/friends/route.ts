import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 });
  }

  try {
    // Fetch friends where the user is either userId1 or userId2
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
      },
    });

    // Extract friend IDs (excluding the user's own ID)
    const friendIds = friendships.map((friendship) =>
      friendship.userId1 === userId ? friendship.userId2 : friendship.userId1
    );

    // Fetch friend details
    const friends = await prisma.user.findMany({
      where: {
        id: { in: friendIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ friends }, { status: 200 });
  } catch (err) {
    console.error('Error fetching friends:', err);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
}
