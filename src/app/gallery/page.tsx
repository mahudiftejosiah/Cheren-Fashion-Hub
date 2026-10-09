import React from 'react';
import { prisma } from '@/lib/prisma';
import { GalleryClient } from './GalleryClient';

export const metadata = {
  title: 'Photo & Video Gallery',
  description: 'View high-definition photos and behind-the-scenes video clips of our bespoke tailoring work.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  const mediaItems = await prisma.media.findMany({
    include: {
      fashionItem: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Visual Experience
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Photo & Video Showcase
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          Immerse yourself in our studio process, runway shows, and client transformations.
        </p>
      </div>

      <GalleryClient mediaItems={mediaItems} videos={videos} />
    </div>
  );
}
