import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.bms.autotrack.ng/api';

export async function GET(request: NextRequest) {
  try {
    // Get the user data from localStorage on the server side
    const user = request.cookies.get('user')?.value;
    const userData = user ? JSON.parse(user) : null;

    if (!userData || !userData.apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in again' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/batteries/distribution`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.apiKey}`,
      },
      cache: 'no-store', // Disable caching
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { 
          error: 'Failed to fetch battery distribution',
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in battery distribution proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 