import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminCollectionsClient } from './AdminCollectionsClient';

export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      fashionItems: {
        include: { media: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Portfolio Management
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Collections & Fashion Items
        </h1>
      </div>

      <AdminCollectionsClient initialCollections={collections} />
    </div>
  );
}
