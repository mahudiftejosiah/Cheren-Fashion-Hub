import React from 'react';
import { prisma } from '@/lib/prisma';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { markNotificationsAsRead } from '@/app/actions/admin';

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
            Real-Time Activity Feed
          </span>
          <h1 className="font-fashion-serif text-3xl font-bold text-white">
            Admin Notification Center
          </h1>
        </div>

        <form action={markNotificationsAsRead}>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-gold-400 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Mark All as Read
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between space-x-4 ${
                notif.isRead
                  ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400'
                  : 'bg-zinc-900 border-gold-500/50 text-white shadow-lg'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-gold-400">{notif.title}</span>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-zinc-300">{notif.message}</p>
              </div>

              <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
