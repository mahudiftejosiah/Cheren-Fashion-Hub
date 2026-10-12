'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteNotificationAction } from '@/app/actions/admin';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export function NotificationsClient({ initialNotifications }: { initialNotifications: NotificationItem[] }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    setDeletingId(id);
    await deleteNotificationAction(id);
    setDeletingId(null);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
            notif.isRead
              ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400'
              : 'bg-zinc-900 border-gold-500/50 text-white shadow-lg'
          }`}
        >
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-gold-400 truncate">{notif.title}</span>
              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping shrink-0" />
              )}
            </div>
            <p className="text-xs text-zinc-300">{notif.message}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:block">
              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={() => handleDelete(notif.id)}
              disabled={deletingId === notif.id}
              className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-colors disabled:opacity-50"
              title="Delete notification"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
