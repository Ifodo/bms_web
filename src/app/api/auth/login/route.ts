import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    loginSchema.parse(body); // Validate the input
    return NextResponse.json({ message: "Login endpoint placeholder" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 