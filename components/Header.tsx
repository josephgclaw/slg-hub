'use client';

import { Bell, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[#080810] border-b border-[#ff0844]/30 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-[#0d0d1a] border border-[#ff0844]/50 flex items-center justify-center text-xs font-bold neon-red"
          style={{ boxShadow: '0 0 8px rgba(255,8,68,0.4), inset 0 0 8px rgba(255,8,68,0.05)' }}
        >
          SLG
        </div>

        {/* Title */}
        <div>
          <div
            className="flex items-center gap-1 text-base font-semibold neon-red neon-pulse uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Soul Lab Gym <ChevronDown size={14} />
          </div>
          <div className="text-xs text-[#8888aa]">Townsville, QLD</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={22} className="text-[#00d4ff]" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
          <div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff0844]"
            style={{ boxShadow: '0 0 6px #ff0844' }}
          />
        </div>
        <Settings size={22} className="text-[#8888aa]" />
      </div>
    </header>
  );
}
