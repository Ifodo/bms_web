import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Define the login request schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Mock user data - In production, this would come from your database
const MOCK_USER = {
  id: '1',
  email: 'admin@bms.com',
  password: 'admin123', // In production, this would be hashed
  role: 'admin'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { email, password } = loginSchema.parse(body);
    
    // In production, you would:
    // 1. Check if user exists in database
    // 2. Compare hashed passwords
    // 3. Handle rate limiting
    // For demo, we'll use mock data
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: MOCK_USER.id,
        email: MOCK_USER.email,
        role: MOCK_USER.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}