'use client';

import { useState } from 'react';
import InboxList from '@/components/InboxList';
import ConversationView from '@/components/ConversationView';
import { GHLConversation } from '@/lib/ghl';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<GHLConversation | null>(null);

  return (
    <div className="flex h-screen">
      {/* Left panel: conversation list */}
      <div className="w-80 border-r border-zinc-800 flex flex-col h-screen overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-lg font-semibold text-zinc-100">Inbox</h1>
        </div>
        <InboxList
          selectedId={selectedConversation?.id || null}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* Right panel: message thread */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {selectedConversation ? (
          <ConversationView conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
