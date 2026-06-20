'use client';

import { Bell, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-black border-b border-zinc-900 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
          SLG
        </div>
        <div>
          <div className="flex items-center gap-1 text-white font-semibold text-base">
            Soul Lab Gym <ChevronDown size={14} />
          </div>
          <div className="text-xs text-zinc-500">Townsville, QLD</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={22} className="text-zinc-400" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"></div>
        </div>
        <Settings size={22} className="text-zinc-400" />
      </div>
    </header>
  );
}
