'use client';

import { useEffect, useState } from 'react';
import { GHLConversation } from '@/lib/ghl';

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffHours < 24 * 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface InboxListProps {
  selectedId: string | null;
  onSelect: (conversation: GHLConversation) => void;
}

export default function InboxList({ selectedId, onSelect }: InboxListProps) {
  const [conversations, setConversations] = useState<GHLConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations || []);
        setError(data.error || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm">Failed to load conversations</p>
          <p className="text-zinc-600 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
        No conversations found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => {
        const name = conv.fullName || conv.contactName || formatPhone(conv.phone) || 'Unknown';
        const isSelected = conv.id === selectedId;
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800 transition-colors ${
              isSelected ? 'bg-zinc-800 border-l-2 border-l-red-600' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-100 text-sm truncate">{name}</span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                {conv.lastMessageBody && (
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{conv.lastMessageBody}</p>
                )}
              </div>
              {conv.lastMessageDate && (
                <span className="text-zinc-600 text-xs shrink-0">{formatDate(conv.lastMessageDate)}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
