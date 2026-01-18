import { NextRequest, NextResponse } from 'next/server';
import Retell from 'retell-sdk';

export async function POST(request: NextRequest) {
  try {
    const retellApiKey = process.env.RETELL_API_KEY;
    
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured. Please set RETELL_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const agentId = process.env.RETELL_AGENT_ID;
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Retell Agent ID not configured. Please set RETELL_AGENT_ID in your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Retell SDK client
    const client = new Retell({
      apiKey: retellApiKey,
    });

    // Create a web call using Retell SDK
    console.log('Creating web call with agent ID:', agentId);
    
    const callResponse = await client.call.createWebCall({
      agent_id: agentId,
      retell_llm_dynamic_variables: {
        organization_name: 'Women for Tomorrow',
      },
    });

    return NextResponse.json({ 
      call_id: callResponse.call_id,
      access_token: callResponse.access_token,
    });
  } catch (error: any) {
    console.error('Error creating call:', error);
    
    // Handle Retell SDK errors
    let errorMessage = 'Failed to create call';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'Please verify your RETELL_API_KEY and RETELL_AGENT_ID in .env.local file.',
      },
      { status: error.status || error.response?.status || 500 }
    );
  }
}
