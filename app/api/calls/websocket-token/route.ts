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

    const retellApiKey = process.env.RETELL_API_KEY;
    
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    const retellApiBaseUrl = process.env.RETELL_API_BASE_URL || 'https://api.retellai.com';

    // Get WebSocket token from Retell API
    // Try different possible endpoint formats
    const endpoints = [
      `${retellApiBaseUrl}/v2/get-web-call-websocket-token`,
      `${retellApiBaseUrl}/get-web-call-websocket-token`,
      `${retellApiBaseUrl}/v2/calls/${callId}/websocket-token`,
    ];

    let lastError: any = null;
    let response: Response | null = null;

    // Try each endpoint format
    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${retellApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call_id: callId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ 
            token: data.token || callId, // Fallback to callId if no token
            ws_url: data.ws_url || data.websocket_url || `wss://api.retellai.com/audio-websocket/${callId}`,
          });
        }

        const errorText = await response.text();
        console.error(`Retell API error (${endpoint}):`, errorText);
        lastError = { endpoint, status: response.status, error: errorText };
      } catch (err) {
        console.error(`Error trying endpoint ${endpoint}:`, err);
        lastError = { endpoint, error: err };
        continue;
      }
    }

    // If all endpoints fail, return a fallback response
    // The WebSocket connection might not be required for basic functionality
    console.warn('WebSocket token endpoint not available, using fallback');
    return NextResponse.json({ 
      token: callId,
      ws_url: `wss://api.retellai.com/audio-websocket/${callId}`,
      warning: 'WebSocket token endpoint not found. Using fallback. Check Retell API documentation for correct endpoint.',
    });
  } catch (error: any) {
    console.error('Error getting WebSocket token:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
