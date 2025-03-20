import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/db';


export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 });
  }
  console.log(userId);
  

  try {
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId, 
      },
      include: {
        user: { select: { id: true, name: true } }, 
      },
      orderBy: { date: 'desc' }, 
    });

    return NextResponse.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}