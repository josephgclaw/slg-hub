'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function formatEventTime(startStr: string, endStr: string): string {
  const s = new Date(startStr);
  const e = new Date(endStr);
  return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatDayHeader(date: Date): string {
  const today = new Date();
  if (sameDay(date, today)) return 'Today, ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADERS = ['S','M','T','W','T','F','S'];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setError(d.error || null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  // Event dates set for dot indicators
  const eventDays = new Set(events.map(e => {
    const d = new Date(e.startTime);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }));

  const hasEvent = (date: Date) => eventDays.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);

  // Events for selected date
  const selectedEvents = events.filter(e => sameDay(new Date(e.startTime), selectedDate));

  // Group all upcoming events by day for list
  const groupedEvents: { date: Date; events: CalendarEvent[] }[] = [];
  const seen = new Set<string>();
  for (const evt of events) {
    const d = new Date(evt.startTime);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!seen.has(key)) {
      seen.add(key);
      groupedEvents.push({ date: d, events: events.filter(e => sameDay(new Date(e.startTime), d)) });
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const goToday = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setSelectedDate(today);
  };

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-zinc-400">
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold text-white text-base">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-zinc-400">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-2 mb-1">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center text-xs text-zinc-500 py-1">{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 px-2 mb-4">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const isToday = sameDay(date, today);
          const isSelected = sameDay(date, selectedDate);
          const dotVisible = hasEvent(date);
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className="flex flex-col items-center justify-center py-1 gap-0.5"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
                  ${isSelected ? 'bg-green-400 text-black font-bold' :
                    isToday ? 'bg-zinc-800 text-white' : 'text-white'}`}
              >
                {date.getDate()}
              </div>
              {dotVisible && !isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              )}
              {!dotVisible && <div className="w-1.5 h-1.5" />}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <div className="px-4 pb-4 flex justify-between items-center">
        <span className="text-sm text-white font-medium">
          {formatDayHeader(selectedDate)}
        </span>
        <button onClick={goToday} className="bg-green-500 text-black rounded-full px-4 py-1.5 text-sm font-semibold">
          Today
        </button>
      </div>

      {/* Events for selected day */}
      {loading && <div className="px-4 text-zinc-500 text-sm">Loading events...</div>}
      {error && <div className="px-4 text-red-400 text-sm">{error}</div>}

      {!loading && selectedEvents.length === 0 && (
        <div className="px-4 py-6 text-center text-zinc-500 text-sm">No appointments on this day</div>
      )}

      {selectedEvents.length > 0 && (
        <div>
          <div className="px-4 py-2">
            <span className="bg-green-900/40 text-green-400 text-xs rounded-full px-3 py-1">
              {formatDayHeader(selectedDate)}
            </span>
          </div>
          {selectedEvents.map(evt => (
            <div key={evt.id} className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900">
              <div className="w-1 h-10 rounded-full bg-green-400 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{evt.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">
                  {formatEventTime(evt.startTime, evt.endTime)}
                  {evt.calendarName ? ` · ${evt.calendarName}` : ''}
                </div>
              </div>
              {evt.contactName && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                  {getInitials(evt.contactName)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upcoming events list (if no specific day is selected beyond today) */}
      {!loading && selectedEvents.length === 0 && groupedEvents.length > 0 && (
        <div>
          <div className="px-4 py-2 border-t border-zinc-900">
            <span className="text-xs text-zinc-500 uppercase tracking-wide">Upcoming</span>
          </div>
          {groupedEvents.slice(0, 3).map(group => (
            <div key={group.date.toISOString()}>
              <div className="px-4 py-2">
                <span className="bg-zinc-900 text-zinc-400 text-xs rounded-full px-3 py-1">
                  {formatDayHeader(group.date)}
                </span>
              </div>
              {group.events.map(evt => (
                <div key={evt.id} className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900">
                  <div className="w-1 h-10 rounded-full bg-green-400 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{evt.title}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">
                      {formatEventTime(evt.startTime, evt.endTime)}
                      {evt.calendarName ? ` · ${evt.calendarName}` : ''}
                    </div>
                  </div>
                  {evt.contactName && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                      {getInitials(evt.contactName)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
