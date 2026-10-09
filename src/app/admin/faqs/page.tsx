import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminFaqsClient } from './AdminFaqsClient';

export const revalidate = 0;

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Knowledgebase Manager
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Frequently Asked Questions (FAQ)
        </h1>
      </div>

      <AdminFaqsClient initialFaqs={faqs} />
    </div>
  );
}
