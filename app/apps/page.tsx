'use client';

import { Grid3x3 } from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-[#0d0d1a] flex items-center justify-center mb-5 neon-border-cyan"
      >
        <Grid3x3 size={28} className="text-[#00d4ff]" style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }} />
      </div>
      <h2
        className="text-lg mb-2 uppercase neon-cyan"
        style={{ fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.1em' }}
      >
        Apps
      </h2>
      <p className="text-[#555577] text-sm">Coming soon</p>
    </div>
  );
}
