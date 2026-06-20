import { NextResponse } from 'next/server';
import { ghlFetch, GHL_LOCATION_ID } from '@/lib/ghl';

export async function GET() {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const results = await Promise.allSettled([
    // New leads (contacts) - total count
    ghlFetch<{ meta?: { total?: number }; contacts?: unknown[] }>(
      `/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`
    ),
    // Pipeline value (opportunities)
    ghlFetch<{ meta?: { total?: number }; opportunities?: unknown[] }>(
      `/opportunities/search?location_id=${GHL_LOCATION_ID}&limit=1`
    ),
    // New conversations
    ghlFetch<{ meta?: { total?: number }; conversations?: unknown[] }>(
      `/conversations/search?locationId=${GHL_LOCATION_ID}&limit=1`
    ),
    // Appointments today - fetch from known calendars
    Promise.allSettled([
      ghlFetch<{ events?: unknown[] }>(
        `/calendars/events?locationId=${GHL_LOCATION_ID}&calendarId=h4rBPhq2GUXySpRQ9VpL&startTime=${todayStart.getTime()}&endTime=${todayEnd.getTime()}`
      ),
      ghlFetch<{ events?: unknown[] }>(
        `/calendars/events?locationId=${GHL_LOCATION_ID}&calendarId=by82Q55oI4R1WpIdaFZP&startTime=${todayStart.getTime()}&endTime=${todayEnd.getTime()}`
      ),
    ]),
  ]);

  // Contacts
  let newLeads = 0;
  if (results[0].status === 'fulfilled') {
    const d = results[0].value as { meta?: { total?: number }; contacts?: unknown[] };
    newLeads = d.meta?.total ?? (d.contacts as unknown[])?.length ?? 0;
  }

  // Pipeline
  let pipelineCount = 0;
  if (results[1].status === 'fulfilled') {
    const d = results[1].value as { meta?: { total?: number }; opportunities?: unknown[] };
    pipelineCount = d.meta?.total ?? (d.opportunities as unknown[])?.length ?? 0;
  }

  // Conversations
  let newConversations = 0;
  if (results[2].status === 'fulfilled') {
    const d = results[2].value as { meta?: { total?: number }; conversations?: unknown[] };
    newConversations = d.meta?.total ?? (d.conversations as unknown[])?.length ?? 0;
  }

  // Appointments today
  let appointmentsToday = 0;
  if (results[3].status === 'fulfilled') {
    const calResults = results[3].value as PromiseSettledResult<{ events?: unknown[] }>[];
    for (const r of calResults) {
      if (r.status === 'fulfilled') {
        appointmentsToday += (r.value.events?.length ?? 0);
      }
    }
  }

  return NextResponse.json({
    newLeads,
    pipelineCount,
    newConversations,
    appointmentsToday,
  });
}
