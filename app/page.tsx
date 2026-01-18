'use client';

import VoiceAgent from '@/components/VoiceAgent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Women for Tomorrow
          </h1>
          <p className="text-gray-500 text-lg font-light">
            Voice Assistant
          </p>
        </div>
        
        <VoiceAgent />
      </div>
    </main>
  );
}
