'use client';

import { useState, useEffect } from 'react';
import { Search, MessageSquare, ChevronLeft, Send } from 'lucide-react';
import { GHLConversation, GHLMessage } from '@/lib/ghl';

// ── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatPhone(phone?: string): string {
  if (!phone) return '';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  return phone;
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffH = (now.getTime() - date.getTime()) / 3600000;
  if (diffH < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffH < 168) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString([], {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── ConversationList ──────────────────────────────────────────────────────────

type FilterTab = 'all' | 'unread' | 'mine';

interface ConversationListProps {
  onSelect: (conv: GHLConversation) => void;
}

function ConversationList({ onSelect }: ConversationListProps) {
  const [conversations, setConversations] = useState<GHLConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => { setConversations(d.conversations || []); setError(d.error || null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'mine', label: 'Mine' },
  ];

  const filtered = conversations.filter(conv => {
    const name = conv.fullName || conv.contactName || formatPhone(conv.phone) || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (conv.lastMessageBody || '').toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      tab === 'all' ? true :
      tab === 'unread' ? conv.unreadCount > 0 :
      true; // 'mine' — no assignee filter available in this API, show all
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-2">
          <Search size={16} className="text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex px-4 gap-5 border-b border-zinc-900 mb-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-green-400 text-green-400'
                : 'border-transparent text-zinc-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">Loading...</div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-red-400 text-sm">Failed to load conversations</p>
            <p className="text-zinc-600 text-xs mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">No conversations found</div>
        )}
        {filtered.map(conv => {
          const name = conv.fullName || conv.contactName || formatPhone(conv.phone) || 'Unknown';
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className="w-full text-left flex items-center gap-3 px-4 py-4 border-b border-zinc-900 active:bg-zinc-900"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-white">
                  {getInitials(name)}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageSquare size={8} className="text-black" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm truncate">{name}</span>
                  <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">
                    {conv.lastMessageDate ? formatRelative(conv.lastMessageDate) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMessageBody || ''}</p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 flex-shrink-0 bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── ThreadView ────────────────────────────────────────────────────────────────

interface ThreadViewProps {
  conversation: GHLConversation;
  onBack: () => void;
}

function ThreadView({ conversation, onBack }: ThreadViewProps) {
  const [messages, setMessages] = useState<GHLMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const name = conversation.fullName || conversation.contactName || formatPhone(conversation.phone) || 'Unknown';

  const loadMessages = () =>
    fetch(`/api/conversations/${conversation.id}/messages`)
      .then(r => r.json())
      .then(d => { setMessages(d.messages || []); setError(d.error || null); })
      .catch(e => setError(e.message));

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setError(null);
    loadMessages().finally(() => setLoading(false));
  }, [conversation.id]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, message: text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to send');
      setText('');
      await loadMessages();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px-96px)]" style={{ height: 'calc(100dvh - 56px - 96px)' }}>
      {/* Thread header */}
      <div className="bg-black border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-green-400 text-sm">
          <ChevronLeft size={18} />
          <span>Conversations</span>
        </button>
      </div>

      {/* Contact info strip */}
      <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-white">
          {getInitials(name)}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{name}</div>
          {conversation.phone && (
            <div className="text-xs text-zinc-500">{formatPhone(conversation.phone)}</div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <div className="text-center text-zinc-500 text-sm py-8">Loading...</div>}
        {error && <div className="text-center text-red-400 text-sm py-8">{error}</div>}
        {!loading && !error && messages.length === 0 && (
          <div className="text-center text-zinc-500 text-sm py-8">No messages yet</div>
        )}
        {messages.map(msg => {
          const out = msg.direction === 'outbound';
          return (
            <div key={msg.id} className={`flex ${out ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 text-sm ${
                  out
                    ? 'bg-green-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-zinc-800 text-white rounded-2xl rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                <p className={`text-xs mt-1 ${out ? 'text-green-200' : 'text-zinc-500'}`}>
                  {formatTime(msg.dateAdded)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="bg-black border-t border-zinc-900 px-4 py-3">
        {sendError && <p className="text-red-400 text-xs mb-2">{sendError}</p>}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Message..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-green-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center disabled:opacity-40 flex-shrink-0"
          >
            <Send size={16} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [selected, setSelected] = useState<GHLConversation | null>(null);

  if (selected) {
    return <ThreadView conversation={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="h-[calc(100vh-56px-96px)]" style={{ height: 'calc(100dvh - 56px - 96px)' }}>
      <ConversationList onSelect={setSelected} />
    </div>
  );
}
