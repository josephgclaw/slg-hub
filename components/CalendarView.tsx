'use client';

import { useEffect, useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  calendarName?: string;
  contactName?: string;
  notes?: string;
  status?: string;
  appointmentStatus?: string;
}

function formatEventTime(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const dateStr = start.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} · ${startTime} – ${endTime}`;
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function statusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-900 text-green-300';
    case 'cancelled':
      return 'bg-red-900 text-red-300';
    case 'showed':
      return 'bg-blue-900 text-blue-300';
    case 'noshow':
    case 'no-show':
      return 'bg-zinc-700 text-zinc-400';
    default:
      return 'bg-zinc-800 text-zinc-400';
  }
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/calendar')
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setError(data.error || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-zinc-500 text-sm">Loading events...</div>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-400 text-sm">Failed to load calendar</p>
        <p className="text-zinc-600 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-sm">No upcoming appointments in the next 7 days</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl">
      {events.map((evt) => {
        const today = isToday(evt.startTime);
        const displayStatus = evt.appointmentStatus || evt.status;
        return (
          <div
            key={evt.id}
            className={`bg-zinc-900 border rounded-xl p-4 ${
              today ? 'border-red-600' : 'border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-zinc-100 text-sm">{evt.title}</h3>
                  {today && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Today
                    </span>
                  )}
                  {displayStatus && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(displayStatus)}`}
                    >
                      {displayStatus}
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs mt-1">{formatEventTime(evt.startTime, evt.endTime)}</p>
                {evt.contactName && (
                  <p className="text-zinc-500 text-xs mt-1">👤 {evt.contactName}</p>
                )}
                {evt.calendarName && (
                  <p className="text-zinc-600 text-xs mt-0.5">📋 {evt.calendarName}</p>
                )}
                {evt.notes && (
                  <p className="text-zinc-500 text-xs mt-2 italic truncate">{evt.notes}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
