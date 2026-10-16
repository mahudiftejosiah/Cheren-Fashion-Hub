import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminVideosClient } from './AdminVideosClient';

export const metadata = { title: 'Manage Videos' };

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white font-fashion-serif">Video Showcase</h1>
          <p className="text-zinc-400 text-xs mt-1">Manage videos that appear on the homepage and gallery. Toggle featured to show on homepage.</p>
        </div>
      </div>
      <AdminVideosClient initialVideos={videos} />
    </div>
  );
}
