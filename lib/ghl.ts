const GHL_BASE_URL = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com';
const GHL_PIT_TOKEN = process.env.GHL_PIT_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

export const GHL_HEADERS = {
  Authorization: `Bearer ${GHL_PIT_TOKEN}`,
  Version: '2021-04-15',
  'Content-Type': 'application/json',
};

export { GHL_BASE_URL, GHL_LOCATION_ID };

export interface GHLConversation {
  id: string;
  contactId: string;
  locationId: string;
  lastMessageBody: string;
  lastMessageDate: string;
  lastMessageType: string;
  type: string;
  unreadCount: number;
  fullName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export interface GHLMessage {
  id: string;
  conversationId: string;
  dateAdded: string;
  body: string;
  direction: 'inbound' | 'outbound';
  status: string;
  type: number;
  contentType: string;
}

export interface GHLCalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  contactName?: string;
  notes?: string;
  status?: string;
  appointmentStatus?: string;
}

export async function ghlFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${GHL_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...GHL_HEADERS,
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
