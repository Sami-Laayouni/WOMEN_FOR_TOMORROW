import { NextRequest, NextResponse } from 'next/server';

// Retell webhook handler for call events
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    console.log('Retell webhook event:', JSON.stringify(event, null, 2));

    // Handle different event types
    switch (event.event) {
      case 'call_started':
        // Handle call started
        console.log('Call started:', event.call_id);
        // You can log this to your database or analytics
        break;
      
      case 'call_ended':
        // Handle call ended
        console.log('Call ended:', event.call_id);
        // Log call duration, outcome, etc.
        break;
      
      case 'conversation_state':
        // Handle conversation state updates
        console.log('Conversation state:', event.conversation_state);
        break;
      
      default:
        console.log('Unknown event type:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
