import { NextRequest, NextResponse } from 'next/server';
import { ghlFetch } from '@/lib/ghl';

interface SendMessageBody {
  conversationId: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendMessageBody;
    const { conversationId, message } = body;

    if (!conversationId || !message?.trim()) {
      return NextResponse.json({ error: 'conversationId and message are required' }, { status: 400 });
    }

    const result = await ghlFetch('/conversations/messages', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SMS',
        conversationId,
        message: message.trim(),
      }),
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
