'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, MessageSquare, CalendarDays, Users, Grid3x3 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: House, exact: true },
  { href: '/inbox', label: 'Conversations', icon: MessageSquare },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/apps', label: 'Apps', icon: Grid3x3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-black border-t border-zinc-900 flex justify-around py-3 pb-6 z-20">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`flex items-center justify-center ${
                isActive ? 'bg-green-500/15 rounded-full px-3 py-1' : 'px-3 py-1'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className={isActive ? 'text-green-400' : 'text-zinc-500'}
              />
            </div>
            <span
              className={`text-xs ${isActive ? 'text-green-400' : 'text-zinc-500'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
