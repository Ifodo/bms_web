import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the auth cookie
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('auth-token');
  return response;
} 