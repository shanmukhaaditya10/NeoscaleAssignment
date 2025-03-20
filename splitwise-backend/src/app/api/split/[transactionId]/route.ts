import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 });
  }

  const url = new URL(req.url);
  const transactionId = url.pathname.split('/').pop(); 

  try {

    if (!transactionId || typeof transactionId !== 'string') {
      return NextResponse.json({ error: 'Transaction ID is required in the URL' }, { status: 400 });
    }


    
    const splits = await prisma.split.findMany({
      where: { transactionId },
      select: { userId: true, amountOwed: true },
    });

    if (splits.length === 0) {
      return NextResponse.json({ friends: [] }, { status: 200 });
    }

    
    const friendIds = splits.map(split => split.userId);
    const friends = await prisma.user.findMany({
      where: { id: { in: friendIds } },
      select: { id: true, name: true }, 
    });

    
    const splitDetails = splits.map(split => {
      const friend = friends.find(f => f.id === split.userId);
      return {
        friendId: split.userId,
        friendName: friend?.name || 'Unknown',
        amountOwed: split.amountOwed,
      };
    });

    return NextResponse.json({ friends: splitDetails }, { status: 200 });
  } catch (err) {
    console.error('Error fetching split details:', err);
    return NextResponse.json({ error: 'Failed to fetch split details' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}