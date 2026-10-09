import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminMessagesClient } from './AdminMessagesClient';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
            Inbox & Support
          </span>
          <h1 className="font-fashion-serif text-3xl font-bold text-white">
            Contact Messages
          </h1>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <AdminMessagesClient initialMessages={messages} />
    </div>
  );
}
