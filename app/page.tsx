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
    <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden">
      <div className="bg-zinc-900/50 px-4 py-2 flex items-center gap-1.5">
        <Clock size={11} className="text-zinc-500" />
        <span className="text-xs text-zinc-500">{periodLabel}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white font-medium">{title}</span>
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-white">
          {count === null ? (
            <span className="text-zinc-600 text-lg">—</span>
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
      icon: <UserPlus size={15} className="text-green-400" />,
      periodLabel: 'Last 30 days',
    },
    {
      title: 'Pipeline',
      count: loading ? null : (stats?.pipelineCount ?? null),
      icon: <DollarSign size={15} className="text-green-400" />,
      periodLabel: 'Last 30 days',
    },
    {
      title: 'New Conversations',
      count: loading ? null : (stats?.newConversations ?? null),
      icon: <MessageSquare size={15} className="text-green-400" />,
      periodLabel: 'Today',
    },
    {
      title: 'Appointments',
      count: loading ? null : (stats?.appointmentsToday ?? null),
      icon: <CalendarDays size={15} className="text-orange-400" />,
      periodLabel: 'Today',
    },
  ];

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Overview</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Welcome back, Soul Lab Gym</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
