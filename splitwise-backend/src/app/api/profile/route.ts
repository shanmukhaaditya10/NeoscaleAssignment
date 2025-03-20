import { NextRequest, NextResponse } from 'next/server';
import { upsertUser } from '../../../../utils/db';

export async function POST(req: NextRequest) {

  const userId = req.headers.get('user-id');
  const userEmail = req.headers.get('user-email');

  
  if (!userId || !userEmail) {
    return NextResponse.json({ error: 'Unauthorized: User data missing' }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required and must be a string' }, { status: 400 });
  }

  try {
    const createdUser = await upsertUser(userId, userEmail, name);
    return NextResponse.json(createdUser);
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}