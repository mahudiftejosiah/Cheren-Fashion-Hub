import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminFeedbackClient } from './AdminFeedbackClient';

export const revalidate = 0;

export default async function AdminFeedbackPage() {
  const raw = await prisma.feedback.findMany({
    include: { order: true },
    orderBy: { createdAt: 'desc' },
  });

  // Map to exactly the shape AdminFeedbackClient expects
  const feedbacks = raw.map((f) => ({
    id: f.id,
    orderId: f.orderId,
    customerName: f.customerName,
    rating: f.rating,
    review: f.review,
    imageUrl: f.imageUrl,
    isApproved: f.isApproved,
    isFeatured: f.isFeatured,
    createdAt: f.createdAt,
    order: f.order ? {
      trackingNumber: f.order.trackingNumber,
      outfitTitle: f.order.outfitTitle,
      customerName: f.order.customerName,
    } : null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Review Moderation
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Customer Feedback & Testimonials
        </h1>
      </div>

      <AdminFeedbackClient initialFeedbacks={feedbacks} />
    </div>
  );
}
