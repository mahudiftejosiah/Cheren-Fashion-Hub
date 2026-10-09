'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitQuoteRequest(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const outfitType = formData.get('outfitType') as string;
  const description = formData.get('description') as string;
  const preferredFabric = (formData.get('preferredFabric') as string) || null;
  const desiredDeadline = (formData.get('desiredDeadline') as string) || null;
  const referenceImageUrl = (formData.get('referenceImageUrl') as string) || null;

  if (!fullName || !phone || !email || !outfitType || !description) {
    return { success: false, error: 'Please complete all required fields.' };
  }

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        outfitType: outfitType.trim(),
        description: description.trim(),
        preferredFabric: preferredFabric ? preferredFabric.trim() : null,
        desiredDeadline: desiredDeadline ? desiredDeadline.trim() : null,
        referenceImageUrl: referenceImageUrl ? referenceImageUrl.trim() : null,
        status: 'PENDING',
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: 'New Quote Request Received',
        message: `${fullName} requested a quote for "${outfitType}".`,
        type: 'QUOTE',
        linkUrl: `/admin/quotes`,
      },
    });

    revalidatePath('/admin/quotes');
    return {
      success: true,
      message: 'Your custom outfit quote request has been submitted! Our studio team will review your details and contact you via phone/email shortly.',
      quoteId: quote.id,
    };
  } catch (err) {
    console.error('Error submitting quote:', err);
    return { success: false, error: 'Failed to submit quote request. Please try again.' };
  }
}
