import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userId = req.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 });
  }

  try {
    const { splits } = await req.json();

    
    if (!Array.isArray(splits) || splits.length === 0) {
      return NextResponse.json({ error: 'Splits array is required and must not be empty' }, { status: 400 });
    }

    const results: { transactionId: string; success: boolean; message?: string }[] = [];
    const successfulSplits: { transactionId: string }[] = [];

    
    for (const split of splits) {
      const { transactionId, friendIds } = split;

      
      if (!transactionId || typeof transactionId !== 'string') {
        results.push({ transactionId: transactionId || 'unknown', success: false, message: 'Transaction ID is required and must be a string' });
        continue;
      }
      if (!Array.isArray(friendIds) || friendIds.length === 0) {
        results.push({ transactionId, success: false, message: 'At least one friend ID is required' });
        continue;
      }

      try {
        
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
          include: { user: true },
        });

        if (!transaction) {
          results.push({ transactionId, success: false, message: 'Transaction not found' });
          continue;
        }
        if (transaction.userId !== userId) {
          results.push({ transactionId, success: false, message: 'Unauthorized: You can only split your own transactions' });
          continue;
        }
        if (transaction.isSplit) {
          results.push({ transactionId, success: false, message: 'Transaction is already split' });
          continue;
        }


   
        
        const totalParticipants = friendIds.length + 1; 
        const splitAmount = transaction.amount / totalParticipants;

        await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transactionId },
              data: { isSplit: true },
            }),
            prisma.split.createMany({
              data: friendIds.map((friendId: string) => ({
                transactionId: transactionId, 
                userId: friendId,            
                amountOwed: splitAmount,     
              })),
            }),
          ]);
        results.push({ transactionId, success: true });
        successfulSplits.push({ transactionId });
      } catch (err) {
        console.error(`Error processing split for transaction ${transactionId}:`, err);
        results.push({ transactionId, success: false, message: 'Failed to process split' });
      }
    }

    return NextResponse.json(
      {
        message: 'Batch split processing completed',
        results,
        successfulSplits,
      },
      { status: 200 } 
    );
  } catch (err) {
    console.error('Error in batch split processing:', err);
    return NextResponse.json({ error: 'Failed to process batch splits' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}