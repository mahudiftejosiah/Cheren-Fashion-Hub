import React from 'react';
import { prisma } from '@/lib/prisma';
import { FaqClient } from './FaqClient';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Answers to common questions about tailoring orders, measurements, delivery, consultations, and apprenticeships.',
};

export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Help & Support
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Find instant answers to common enquiries about our tailoring process, fitting sessions, tracking, and delivery.
        </p>
      </div>

      <FaqClient faqs={faqs} />
    </div>
  );
}
