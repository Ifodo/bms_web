import { NextResponse } from 'next/server';

const API_URL = 'https://api.bms.autotrack.ng/auth/register';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, apiKey, chargingStation } = body;

    // Validate required fields
    if (!email || !password || !username || !apiKey || !chargingStation) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
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
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Registration error:', error);
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