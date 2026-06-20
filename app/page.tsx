'use client';

import { useEffect, useState } from 'react';
import { UserPlus, DollarSign, MessageSquare, CalendarDays, Clock } from 'lucide-react';

interface Stats {
  newLeads: number;
  pipelineCount: number;
  newConversations: number;
  appointmentsToday: number;
}

interface StatCardProps {
  title: string;
  count: number | null;
  icon: React.ReactNode;
  periodLabel: string;
}

function StatCard({ title, count, icon, periodLabel }: StatCardProps) {
  return (
    <div
      className="bg-[#0d0d1a] rounded-2xl overflow-hidden neon-border-red"
    >
      {/* Header strip */}
      <div className="bg-[#12122a] px-4 py-2 flex items-center gap-1.5">
        <Clock size={11} className="text-[#555577]" />
        <span className="text-xs text-[#555577] uppercase tracking-wider">{periodLabel}</span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm text-[#8888aa] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            {title}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#ff0844]/10 border border-[#ff0844]/30 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div
          className="text-3xl neon-cyan"
          style={{ fontFamily: 'var(--font-press-start), monospace', lineHeight: 1.2 }}
        >
          {count === null ? (
            <span className="text-[#555577] text-lg">—</span>
          ) : (
            count.toLocaleString()
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'New Leads',
      count: loading ? null : (stats?.newLeads ?? null),
      icon: <UserPlus size={15} className="text-[#ff0844]" style={{ filter: 'drop-shadow(0 0 4px #ff0844)' }} />,
      periodLabel: 'Last 30 days',
    },
    {
      title: 'Pipeline',
      count: loading ? null : (stats?.pipelineCount ?? null),
      icon: <DollarSign size={15} className="text-[#ff0844]" style={{ filter: 'drop-shadow(0 0 4px #ff0844)' }} />,
      periodLabel: 'Last 30 days',
    },
    {
      title: 'Convos',
      count: loading ? null : (stats?.newConversations ?? null),
      icon: <MessageSquare size={15} className="text-[#ff0844]" style={{ filter: 'drop-shadow(0 0 4px #ff0844)' }} />,
      periodLabel: 'Today',
    },
    {
      title: 'Appts',
      count: loading ? null : (stats?.appointmentsToday ?? null),
      icon: <CalendarDays size={15} className="text-[#ff0844]" style={{ filter: 'drop-shadow(0 0 4px #ff0844)' }} />,
      periodLabel: 'Today',
    },
  ];

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5">
        <h1
          className="text-xl uppercase neon-red flicker"
          style={{ fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.1em' }}
        >
          Overview
        </h1>
        <p className="text-sm text-[#555577] mt-0.5">Welcome back, Soul Lab Gym</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
