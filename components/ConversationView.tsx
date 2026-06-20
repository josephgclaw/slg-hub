'use client';

import { useEffect, useRef, useState } from 'react';
import { GHLConversation, GHLMessage } from '@/lib/ghl';

function formatPhone(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ConversationViewProps {
  conversation: GHLConversation;
}

export default function ConversationView({ conversation }: ConversationViewProps) {
  const [messages, setMessages] = useState<GHLMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contactName =
    conversation.fullName ||
    conversation.contactName ||
    formatPhone(conversation.phone) ||
    'Unknown';

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setError(null);
    fetch(`/api/conversations/${conversation.id}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
        setError(data.error || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, message: replyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setReplyText('');
      // Refresh messages
      const refreshed = await fetch(`/api/conversations/${conversation.id}/messages`).then((r) =>
        r.json()
      );
      setMessages(refreshed.messages || []);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900">
        <div className="font-semibold text-zinc-100">{contactName}</div>
        {conversation.phone && (
          <div className="text-xs text-zinc-500 mt-0.5">{formatPhone(conversation.phone)}</div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            Loading messages...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 text-sm">Failed to load messages</p>
              <p className="text-zinc-600 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No messages yet
          </div>
        )}
        {messages.map((msg) => {
          const isOutbound = msg.direction === 'outbound';
          return (
            <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                  isOutbound
                    ? 'bg-red-600 text-white rounded-br-sm'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOutbound ? 'text-red-200' : 'text-zinc-500'
                  }`}
                >
                  {formatTime(msg.dateAdded)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      <div className="border-t border-zinc-800 bg-zinc-900 p-4">
        {sendError && (
          <p className="text-red-400 text-xs mb-2">{sendError}</p>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={2}
            className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-red-600"
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim() || sending}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
