import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export const metadata = {
  title: 'Admin Studio Management Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let unreadNotificationsCount = 0;
  try {
    unreadNotificationsCount = await prisma.notification.count({
      where: { isRead: false },
    });
  } catch (err) {
    console.error('Failed to count unread notifications:', err);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminSidebar unreadNotificationsCount={unreadNotificationsCount} />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </div>
  );
}
