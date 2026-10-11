import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminOrdersClient } from './AdminOrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const raw = await prisma.order.findMany({
    include: {
      history: { orderBy: { createdAt: 'desc' } },
      feedback: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map to exactly the shape AdminOrdersClient expects
  const orders = raw.map((order) => ({
    id: order.id,
    trackingNumber: order.trackingNumber,
    trackingId: order.trackingId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    outfitTitle: order.outfitTitle,
    description: order.description,
    measurements: order.measurements,
    status: order.status,
    expectedCompletionDate: order.expectedCompletionDate,
    deliveryAddress: order.deliveryAddress,
    confirmedAt: order.confirmedAt,
    internalNotes: order.internalNotes,
    createdAt: order.createdAt,
    feedback: order.feedback,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Studio Workflow
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Order & Tailoring Management
        </h1>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
