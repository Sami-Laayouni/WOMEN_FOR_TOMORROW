import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { callId } = await request.json();

    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    // End the call via Retell API if needed
    // Retell handles call ending automatically, but you can add custom logic here
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error ending call:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
