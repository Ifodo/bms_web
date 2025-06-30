import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
    const token = sign(
      {
        userId: MOCK_USER.id,
        email: MOCK_USER.email,
        role: MOCK_USER.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        role: MOCK_USER.role
      }
    });
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