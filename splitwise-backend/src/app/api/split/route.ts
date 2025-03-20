import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userId = req.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 });
  }

  try {
    const { transactionId, friendIds } = await req.json();

    
    if (!transactionId || typeof transactionId !== 'string') {
      return NextResponse.json({ error: 'Transaction ID is required and must be a string' }, { status: 400 });
    }
    if (!Array.isArray(friendIds) || friendIds.length === 0) {
      return NextResponse.json({ error: 'At least one friend ID is required' }, { status: 400 });
    }

    
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    if (transaction.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only split your own transactions' }, { status: 403 });
    }
    if (transaction.isSplit) {
      return NextResponse.json({ error: 'Transaction is already split' }, { status: 400 });
    }

    
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId1: userId, userId2: { in: friendIds } },
          { userId2: userId, userId1: { in: friendIds } },
        ],
      },
      select: { userId1: true, userId2: true },
    });

    const validFriendIds = friends.map(f => (f.userId1 === userId ? f.userId2 : f.userId1));
    const invalidFriendIds = friendIds.filter((id: string) => !validFriendIds.includes(id));
    if (invalidFriendIds.length > 0) {
      return NextResponse.json(
        { error: `Invalid friend IDs: ${invalidFriendIds.join(', ')} are not your friends` },
        { status: 400 }
      );
    }

    
    const totalParticipants = friendIds.length + 1; 
    const splitAmount = transaction.amount / totalParticipants;

    
    await prisma.$transaction([
      
      prisma.transaction.update({
        where: { id: transactionId },
        data: { isSplit: true },
      }),
      
      prisma.split.createMany({
        data: [
         
          ...friendIds.map((friendId: string) => ({
            transactionId,
            userId: friendId,
            amountOwed: splitAmount,
          })),
        ],
      }),
    ]);

    return NextResponse.json(
      {
        message: 'Transaction split successfully',
        splitAmount,
        participants: totalParticipants,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error splitting transaction:', err);
    return NextResponse.json({ error: 'Failed to split transaction' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

