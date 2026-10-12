import React from 'react';
import { prisma } from '@/lib/prisma';
import { markNotificationsAsRead, deleteAllNotificationsAction } from '@/app/actions/admin';
import { NotificationsClient } from './NotificationsClient';

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function markAllRead() {
    'use server';
    await markNotificationsAsRead();
  }

  async function deleteAll() {
    'use server';
    await deleteAllNotificationsAction();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
            Real-Time Activity Feed
          </span>
          <h1 className="font-fashion-serif text-3xl font-bold text-white">
            Admin Notification Center
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <form action={markAllRead}>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-gold-400 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Mark All as Read
            </button>
          </form>
          {notifications.length > 0 && (
            <form action={deleteAll}>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-400 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Delete All
              </button>
            </form>
          )}
        </div>
      </div>

      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
