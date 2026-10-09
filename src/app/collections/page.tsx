import React from 'react';
import { prisma } from '@/lib/prisma';
import { CollectionClient } from './CollectionClient';

export const metadata = {
  title: 'Fashion Collections & Bespoke Portfolio',
  description: 'Browse our signature fashion designs across Women\'s Wear, Men\'s Wear, Agbada, Occasion Wear, and Custom Designs.',
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  const fashionItems = await prisma.fashionItem.findMany({
    include: { media: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-pink-400 uppercase tracking-widest block mb-2 font-cinzel">
          Bespoke Gallery
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Our Fashion Collections
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          Explore handcrafted outfits tailored with premium fabrics and impeccable artistry. Select any design to view detailed imagery or request a custom recreation.
        </p>
      </div>

      {/* Interactive Client Gallery */}
      <CollectionClient collections={collections} fashionItems={fashionItems} />
    </div>
  );
}
