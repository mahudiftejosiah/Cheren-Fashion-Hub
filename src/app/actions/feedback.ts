'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitCustomerFeedback(formData: FormData) {
  const trackingNumber = formData.get('trackingNumber') as string;
  const ratingStr = formData.get('rating') as string;
  const review = formData.get('review') as string;
  const customerName = formData.get('customerName') as string;
  const imageUrl = (formData.get('imageUrl') as string) || null;

  if (!ratingStr || !review || !customerName) {
    return { success: false, error: 'Please provide a star rating, your name, and written feedback.' };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5 stars.' };
  }

  try {
    let orderId: string | null = null;

    if (trackingNumber) {
      const order = await prisma.order.findUnique({
        where: { trackingNumber },
        include: { feedback: true },
      });

      if (order) {
        if (order.feedback) {
          return { success: false, error: 'Feedback has already been submitted for this order.' };
        }
        orderId = order.id;
      }
    }

    // Create Feedback entry in PENDING moderation state
    const feedback = await prisma.feedback.create({
      data: {
        orderId,
        customerName: customerName.trim(),
        rating,
        review: review.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        isApproved: false, // Requires admin approval
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: 'New Customer Feedback Received',
        message: `${customerName} submitted a ${rating}-star review: "${review.slice(0, 50)}..."`,
        type: 'FEEDBACK',
        linkUrl: `/admin/feedback`,
      },
    });

    revalidatePath('/track-order');
    revalidatePath('/admin/feedback');
    revalidatePath('/');

    return {
      success: true,
      message: 'Thank you for your feedback! Your review has been submitted for verification.',
    };
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return { success: false, error: 'Failed to submit review. Please try again.' };
  }
}

export async function moderateFeedback(feedbackId: string, action: 'APPROVE' | 'REJECT' | 'DELETE' | 'FEATURE') {
  try {
    if (action === 'DELETE') {
      await prisma.feedback.delete({ where: { id: feedbackId } });
    } else if (action === 'APPROVE') {
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { isApproved: true },
      });
    } else if (action === 'REJECT') {
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { isApproved: false, isFeatured: false },
      });
    } else if (action === 'FEATURE') {
      const current = await prisma.feedback.findUnique({ where: { id: feedbackId } });
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { isFeatured: !current?.isFeatured, isApproved: true },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/feedback');
    return { success: true };
  } catch (err) {
    console.error('Error moderating feedback:', err);
    return { success: false, error: 'Moderation failed.' };
  }
}
