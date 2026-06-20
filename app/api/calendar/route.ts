import { NextResponse } from 'next/server';
import { ghlFetch, GHL_LOCATION_ID, GHLCalendarEvent } from '@/lib/ghl';

interface CalendarsResponse {
  calendars: Array<{ id: string; name: string }>;
}

interface EventsResponse {
  events: GHLCalendarEvent[];
}

export async function GET() {
  try {
    const now = Date.now();
    const endTime = now + 7 * 24 * 60 * 60 * 1000; // +7 days

    // Get list of calendars first
    const calendarsData = await ghlFetch<CalendarsResponse>(
      `/calendars/?locationId=${GHL_LOCATION_ID}`
    );
    const calendars = calendarsData.calendars || [];

    // Build calendar name map
    const calendarMap: Record<string, string> = {};
    for (const cal of calendars) {
      calendarMap[cal.id] = cal.name;
    }

    // Get events
    const eventsData = await ghlFetch<EventsResponse>(
      `/calendars/events?locationId=${GHL_LOCATION_ID}&startTime=${now}&endTime=${endTime}`
    );

    const events = (eventsData.events || []).map((evt) => ({
      ...evt,
      calendarName: calendarMap[evt.calendarId] || 'Unknown Calendar',
    }));

    // Sort by startTime ascending
    events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return NextResponse.json({ events, calendars });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, events: [], calendars: [] }, { status: 500 });
  }
}
