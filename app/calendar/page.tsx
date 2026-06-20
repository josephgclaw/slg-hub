'use client';

import CalendarView from '@/components/CalendarView';

export default function CalendarPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Calendar</h1>
        <p className="text-sm text-zinc-400 mt-1">Upcoming appointments — today + next 7 days</p>
      </div>
      <CalendarView />
    </div>
  );
}
