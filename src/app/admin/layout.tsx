import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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

      {/*
        Main content area:
        - Mobile (<lg): full width, pt-[61px] clears the fixed mobile top bar
        - lg+: ml-64 pushes content right of the 256px sidebar, no top padding needed
        - overflow-x-hidden: prevents wide tables/cards from bleeding under the sidebar
        - max-w-full: ensures content never exceeds the viewport minus sidebar
      */}
      <main className="lg:ml-64 min-h-screen pt-[61px] lg:pt-0 overflow-x-hidden">
        <div className="w-full max-w-full p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
