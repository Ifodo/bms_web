import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function middleware() {
  // Removed authentication check to allow direct access
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
}; 