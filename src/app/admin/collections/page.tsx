import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminCollectionsClient } from './AdminCollectionsClient';

export const revalidate = 0;
// v2 — explicit Prisma mapping to fix Vercel build type errors

export default async function AdminCollectionsPage() {
  const raw = await prisma.collection.findMany({
    include: {
      fashionItems: {
        include: { media: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map Prisma result to the exact shape AdminCollectionsClient expects
  const collections = raw.map((col) => ({
    id: col.id,
    title: col.title,
    slug: col.slug,
    category: col.category,
    description: col.description,
    coverImage: col.coverImage,
    isFeatured: col.isFeatured,
    fashionItems: col.fashionItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      isFeatured: item.isFeatured,
      media: item.media.map((m) => ({
        id: m.id,
        url: m.url,
      })),
    })),
  }));

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
