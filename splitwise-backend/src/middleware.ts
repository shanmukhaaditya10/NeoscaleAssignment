import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req: NextRequest) {


  const authHeader = req.headers.get('Authorization');
  
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Bearer token found');
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log('Supabase Response:', { user, error });

  if (error || !user) {
    console.log('Token verification failed:', error?.message);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('user-id', user.id);
  requestHeaders.set('user-email', user.email!);
  console.log('Headers set:', { 'user-id': user.id, 'user-email': user.email });

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
    matcher: '/api/(.*)',
  };
  