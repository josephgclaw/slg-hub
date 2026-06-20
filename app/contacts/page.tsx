'use client';

import { Users } from 'lucide-react';

export default function ContactsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-[#0d0d1a] flex items-center justify-center mb-5 neon-border-red"
      >
        <Users size={28} className="text-[#ff0844]" style={{ filter: 'drop-shadow(0 0 6px #ff0844)' }} />
      </div>
      <h2
        className="text-lg mb-2 uppercase neon-red"
        style={{ fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.1em' }}
      >
        Contacts
      </h2>
      <p className="text-[#555577] text-sm">Coming soon</p>
    </div>
  );
}
