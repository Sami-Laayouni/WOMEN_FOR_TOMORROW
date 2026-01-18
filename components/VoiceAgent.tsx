'use client';

import { useState, useEffect, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

interface CallState {
  status: 'idle' | 'connecting' | 'connected' | 'ended' | 'error';
  callId?: string;
  error?: string;
}

export default function VoiceAgent() {
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Retell Web Client
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Set up event listeners
    client.on('call_started', () => {
      console.log('✅ Call started');
      setCallState(prev => ({ ...prev, status: 'connected' }));
      setIsAgentSpeaking(false);
      setIsListening(false); // Start with neither - wait for agent to speak first
      
      // Wait a moment before starting demo animations (let agent speak first)
      setTimeout(() => {
        // START DEMO ANIMATIONS - Agent speaks first, then listens
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
        
        // Start with agent speaking
        setIsAgentSpeaking(true);
        setIsListening(false);
        
        let isSpeaking = true; // Start with speaking
        animationIntervalRef.current = setInterval(() => {
          isSpeaking = !isSpeaking;
          console.log('🎬 Animation:', isSpeaking ? 'SPEAKING' : 'LISTENING');
          setIsAgentSpeaking(isSpeaking);
          setIsListening(!isSpeaking);
        }, 3000); // Longer interval - 3 seconds
      }, 1500); // Wait 1.5 seconds before starting animations
    });

    // Real Retell events (will override demo if they fire)
    client.on('agent_start_talking', () => {
      console.log('🎤 Agent started talking');
      setIsAgentSpeaking(true);
      setIsListening(false);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    });

    client.on('agent_stop_talking', () => {
      console.log('🔇 Agent stopped talking');
      setIsAgentSpeaking(false);
      setIsListening(true);
    });

    client.on('call_ended', () => {
      console.log('❌ Call ended');
      setCallState({ status: 'ended' });
      setIsAgentSpeaking(false);
      setIsListening(false);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    });

    client.on('error', (error: any) => {
      console.error('❌ Retell error:', error);
      setCallState({ status: 'error', error: error.message || 'Call error occurred' });
    });

    return () => {
      // Cleanup
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, []);

  const startCall = async () => {
    try {
      setCallState({ status: 'connecting' });
      setIsAgentSpeaking(false);
      setIsListening(false);
      
      const response = await fetch('/api/calls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create call');
      }

      const data = await response.json();
      
      if (data.access_token && retellClientRef.current) {
        await retellClientRef.current.startCall({ 
          accessToken: data.access_token 
        });
        setCallState({ status: 'connected', callId: data.call_id });
      } else {
        throw new Error('Missing access_token or client not initialized');
      }
    } catch (error: any) {
      console.error('Error starting call:', error);
      setCallState({ status: 'error', error: error.message || 'Failed to start call' });
    }
  };

  const endCall = async () => {
    try {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      setCallState({ status: 'ended' });
      setIsAgentSpeaking(false);
      setIsListening(false);
    } catch (error: any) {
      console.error('Error ending call:', error);
    }
  };

  const toggleMute = () => {
    if (!retellClientRef.current || callState.status !== 'connected') {
      console.warn('Cannot mute: call not active');
      return;
    }
    
    try {
      const newMutedState = !isMuted;
      if (newMutedState) {
        retellClientRef.current.mute();
        console.log('🔇 MUTED');
      } else {
        retellClientRef.current.unmute();
        console.log('🔊 UNMUTED');
      }
      setIsMuted(newMutedState);
    } catch (error: any) {
      console.error('❌ Mute error:', error);
      alert(`Mute error: ${error.message || 'Unknown error'}`);
    }
  };

  // Determine status text
  const getStatusText = () => {
    if (callState.status === 'idle') return 'Ready to connect';
    if (callState.status === 'connecting') return 'Connecting';
    if (callState.status === 'ended') return 'Call ended';
    if (callState.status === 'error') return callState.error || 'Error';
    if (callState.status === 'connected') {
      if (isAgentSpeaking) return 'Agent is speaking';
      if (isListening) return 'Listening';
      return 'Connected'; // Show "Connected" when neither speaking nor listening yet
    }
    return 'Unknown';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        {/* Voice indicator */}
        <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
          {/* SPEAKING: Expanding rings */}
          {isAgentSpeaking && callState.status === 'connected' && (
            <>
              <div className="absolute w-48 h-48 rounded-full border-2 border-blue-300/60" style={{ animation: 'talking-ring-1 2s ease-out infinite' }}></div>
              <div className="absolute w-48 h-48 rounded-full border-2 border-blue-400/50" style={{ animation: 'talking-ring-2 2s ease-out infinite 0.4s' }}></div>
              <div className="absolute w-48 h-48 rounded-full border-2 border-blue-500/40" style={{ animation: 'talking-ring-3 2s ease-out infinite 0.8s' }}></div>
            </>
          )}
          
          {/* LISTENING: Pulsing circles - only show when actually listening */}
          {isListening && !isAgentSpeaking && callState.status === 'connected' && (
            <>
              <div className="absolute w-48 h-48 rounded-full bg-emerald-100/50" style={{ animation: 'listening-pulse-1 2.5s ease-in-out infinite' }}></div>
              <div className="absolute w-44 h-44 rounded-full bg-emerald-200/40" style={{ animation: 'listening-pulse-2 2.5s ease-in-out infinite 0.6s' }}></div>
            </>
          )}

          {/* Main circle */}
          <div 
            className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
              isAgentSpeaking && callState.status === 'connected'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : isListening && callState.status === 'connected'
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' 
                  : callState.status === 'connected'
                    ? 'bg-gray-200'
                    : 'bg-gray-100'
            }`}
            style={{
              boxShadow: isAgentSpeaking && callState.status === 'connected'
                ? '0 20px 60px rgba(59, 130, 246, 0.4)' 
                : isListening && callState.status === 'connected'
                  ? '0 20px 60px rgba(16, 185, 129, 0.4)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Waveform bars when SPEAKING */}
            {isAgentSpeaking && callState.status === 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '6px', animation: 'wave-1 0.9s ease-in-out infinite' }}></div>
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '10px', animation: 'wave-2 0.9s ease-in-out infinite 0.15s' }}></div>
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '14px', animation: 'wave-3 0.9s ease-in-out infinite 0.3s' }}></div>
                <div className="w-1 bg-white rounded-full" style={{ height: '18px', animation: 'wave-4 0.9s ease-in-out infinite 0.45s' }}></div>
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '14px', animation: 'wave-3 0.9s ease-in-out infinite 0.3s' }}></div>
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '10px', animation: 'wave-2 0.9s ease-in-out infinite 0.15s' }}></div>
                <div className="w-1 bg-white/90 rounded-full" style={{ height: '6px', animation: 'wave-1 0.9s ease-in-out infinite' }}></div>
              </div>
            )}
            
            {/* Microphone icon */}
            {(!isAgentSpeaking || callState.status !== 'connected') && (
              <svg
                className={`w-20 h-20 transition-all duration-500 ${
                  isListening && callState.status === 'connected'
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </div>
        </div>
        
        {/* Status text */}
        <div className="mb-10">
          <p className="text-lg font-light text-gray-600 tracking-wide">
            {getStatusText()}
          </p>
          {isMuted && callState.status === 'connected' && (
            <p className="text-sm text-rose-500 mt-2 font-medium">Microphone muted</p>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex justify-center gap-4">
          {callState.status === 'idle' || callState.status === 'ended' || callState.status === 'error' ? (
            <button
              onClick={startCall}
              className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Call
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                disabled={callState.status !== 'connected'}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isMuted
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                } ${callState.status !== 'connected' ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow'}`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={endCall}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow"
              >
                End Call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
