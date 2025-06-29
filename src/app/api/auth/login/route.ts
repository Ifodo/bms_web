import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signToken } from '@/utils/jwt';

// Input validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const API_URL = 'https://api.bms.autotrack.ng/auth/login';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          code: 400,
          returnStatus: 'BAD_REQUEST'
        },
        { status: 400 }
      );
    }

    // Forward the request to the AutoTrack BMS API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    // Set the auth token as an HTTP-only cookie if login was successful
    if (data.success && data.token) {
      const response = NextResponse.json(data);
      response.cookies.set('auth-token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });
      return response;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        code: 500,
        returnStatus: 'ERROR'
      },
      { status: 500 }
    );
  }
} 