'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { WORKFLOW_STAGES } from '@/lib/constants';

export async function getOrderByTrackingNumber(trackingNumber: string) {
  if (!trackingNumber || trackingNumber.trim() === '') {
    return { success: false, error: 'Please enter a valid tracking number.' };
  }

  const cleanTracking = trackingNumber.trim().toUpperCase();

  try {
    const order = await prisma.order.findUnique({
      where: { trackingNumber: cleanTracking },
      include: {
        history: {
          orderBy: { createdAt: 'asc' },
        },
        feedback: true,
      },
    });

    if (!order) {
      return { success: false, error: `No order found with tracking reference "${cleanTracking}".` };
    }

    const currentStageIndex = WORKFLOW_STAGES.indexOf(order.status);

    return {
      success: true,
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        customerName: order.customerName,
        outfitTitle: order.outfitTitle,
        description: order.description,
        status: order.status,
        expectedCompletionDate: order.expectedCompletionDate,
        deliveryAddress: order.deliveryAddress,
        confirmedAt: order.confirmedAt ? order.confirmedAt.toISOString() : null,
        history: order.history.map((h) => ({
          id: h.id,
          status: h.status,
          note: h.note,
          createdAt: h.createdAt.toISOString(),
        })),
        hasFeedback: !!order.feedback,
        stageIndex: currentStageIndex >= 0 ? currentStageIndex : 0,
      },
    };
  } catch (err) {
    console.error('Error tracking order:', err);
    return { success: false, error: 'Server error while fetching order details.' };
  }
}

export async function confirmOrderReceipt(trackingNumber: string) {
  if (!trackingNumber) {
    return { success: false, error: 'Tracking number is required.' };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { trackingNumber },
    });

    if (!order) {
      return { success: false, error: 'Order not found.' };
    }

    if (order.confirmedAt || order.status === 'CUSTOMER_CONFIRMED') {
      return { success: false, error: 'Delivery has already been confirmed for this order.' };
    }

    if (order.status !== 'DELIVERED') {
      return { success: false, error: 'Receipt can only be confirmed after order status is marked as DELIVERED.' };
    }

    const confirmedAt = new Date();
    // Schedule auto-delete 24 hours after customer confirms receipt
    const deleteAt = new Date(confirmedAt.getTime() + 24 * 60 * 60 * 1000);

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { trackingNumber },
      data: {
        status: 'CUSTOMER_CONFIRMED',
        confirmedAt,
        deleteAt,
        history: {
          create: {
            status: 'CUSTOMER_CONFIRMED',
            note: 'Customer confirmed physical receipt of outfit online.',
          },
        },
      },
    });

    // Create Notification for Admin
    await prisma.notification.create({
      data: {
        title: 'Customer Receipt Confirmed!',
        message: `${order.customerName} has confirmed receipt of order ${order.trackingNumber} (${order.outfitTitle}).`,
        type: 'CONFIRMATION',
        linkUrl: `/admin/orders`,
      },
    });

    revalidatePath('/track-order');
    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Delivery receipt confirmed! Thank you. You can now leave your 5-star review below.',
      confirmedAt: updatedOrder.confirmedAt?.toISOString(),
    };
  } catch (err) {
    console.error('Error confirming order receipt:', err);
    return { success: false, error: 'Failed to confirm receipt. Please try again.' };
  }
}
