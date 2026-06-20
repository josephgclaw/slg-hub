import { NextResponse } from 'next/server';
import { ghlFetch, GHL_LOCATION_ID, GHLConversation } from '@/lib/ghl';

interface ConversationsResponse {
  conversations: GHLConversation[];
  total?: number;
}

export async function GET() {
  try {
    const data = await ghlFetch<ConversationsResponse>(
      `/conversations/search?locationId=${GHL_LOCATION_ID}&limit=20`
    );
    return NextResponse.json({ conversations: data.conversations || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, conversations: [] }, { status: 500 });
  }
}
