import { NextResponse } from 'next/server';
import { ghlFetch, GHLMessage } from '@/lib/ghl';

interface MessagesResponse {
  messages: {
    messages: GHLMessage[];
    total?: number;
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await ghlFetch<MessagesResponse>(
      `/conversations/${id}/messages?limit=50`
    );
    const messages = data.messages?.messages || [];
    // Sort oldest to newest
    const sorted = [...messages].sort(
      (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    );
    return NextResponse.json({ messages: sorted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, messages: [] }, { status: 500 });
  }
}
