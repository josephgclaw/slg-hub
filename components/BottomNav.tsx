'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, MessageSquare, CalendarDays, Users, Grid3x3 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: House, exact: true },
  { href: '/inbox', label: 'Convos', icon: MessageSquare },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/apps', label: 'Apps', icon: Grid3x3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#080810] border-t border-[#ff0844]/20 flex justify-around py-3 pb-6 z-20">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`flex items-center justify-center px-3 py-1 ${
                isActive
                  ? 'bg-[#ff0844]/10 border border-[#ff0844]/30 rounded-full'
                  : ''
              }`}
              style={isActive ? { boxShadow: '0 0 8px rgba(255,8,68,0.2)' } : undefined}
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className={isActive ? 'text-[#ff0844]' : 'text-[#555577]'}
                style={isActive ? { filter: 'drop-shadow(0 0 4px #ff0844)' } : undefined}
              />
            </div>
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: isActive ? '#ff0844' : '#555577',
                textShadow: isActive ? '0 0 6px #ff0844' : 'none',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
