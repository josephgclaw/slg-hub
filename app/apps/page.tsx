'use client';

import { Grid3x3 } from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center mb-5">
        <Grid3x3 size={28} className="text-zinc-500" />
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">Apps</h2>
      <p className="text-zinc-500 text-sm">Coming soon</p>
    </div>
  );
}
