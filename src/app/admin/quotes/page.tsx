import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminQuotesClient } from './AdminQuotesClient';

export const revalidate = 0;

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Inquiries & Estimations
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Quote Requests
        </h1>
      </div>

      <AdminQuotesClient initialQuotes={quotes} />
    </div>
  );
}
