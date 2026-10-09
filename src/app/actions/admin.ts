'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderConfirmationEmail } from '@/lib/email';

// --- ORDERS ---
export async function createAdminOrder(formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const customerEmail = formData.get('customerEmail') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const outfitTitle = formData.get('outfitTitle') as string;
  const description = formData.get('description') as string;
  const measurements = (formData.get('measurements') as string) || null;
  const deliveryAddress = (formData.get('deliveryAddress') as string) || null;
  const expectedCompletionDate = (formData.get('expectedCompletionDate') as string) || null;
  const internalNotes = (formData.get('internalNotes') as string) || null;

  if (!customerName || !customerEmail || !customerPhone || !outfitTitle || !description) {
    return { success: false, error: 'Please provide customer and outfit details.' };
  }

  try {
    // Generate unique tracking number e.g. FH-2026-0042
    const currentYear = new Date().getFullYear();
    const count = await prisma.order.count();
    const sequence = (count + 1).toString().padStart(4, '0');
    const trackingNumber = `FH-${currentYear}-${sequence}`;

    // Upsert customer record
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail.trim().toLowerCase() },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone.trim(),
          address: deliveryAddress,
        },
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        trackingNumber,
        trackingId: crypto.randomUUID(),
        customerId: customer.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        outfitTitle: outfitTitle.trim(),
        description: description.trim(),
        measurements: measurements ? measurements.trim() : null,
        deliveryAddress: deliveryAddress ? deliveryAddress.trim() : null,
        expectedCompletionDate: expectedCompletionDate ? expectedCompletionDate.trim() : null,
        internalNotes: internalNotes ? internalNotes.trim() : null,
        status: 'ORDER_RECEIVED',
        history: {
          create: {
            status: 'ORDER_RECEIVED',
            note: 'Order created by admin in studio system.',
          },
        },
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/track-order');

    // Send confirmation email to customer (non-fatal — won't fail order creation)
    await sendOrderConfirmationEmail({
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      trackingNumber: newOrder.trackingNumber,
      outfitTitle: newOrder.outfitTitle,
      expectedCompletionDate: newOrder.expectedCompletionDate,
    });

    return { success: true, trackingNumber: newOrder.trackingNumber, trackingId: newOrder.trackingId };
  } catch (err) {
    console.error('Error creating order:', err);
    return { success: false, error: 'Failed to create order.' };
  }
}

export async function updateOrderStatusAction(orderId: string, newStatus: string, note?: string) {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { success: false, error: 'Order not found.' };

    const updateData: any = {
      status: newStatus,
      history: {
        create: {
          status: newStatus,
          note: note || `Status updated to ${newStatus} by admin.`,
        },
      },
    };

    if (newStatus === 'CUSTOMER_CONFIRMED' && !order.confirmedAt) {
      const confirmedAt = new Date();
      updateData.confirmedAt = confirmedAt;
      // Schedule auto-delete 24 hours after confirmation
      updateData.deleteAt = new Date(confirmedAt.getTime() + 24 * 60 * 60 * 1000);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath('/admin/orders');
    revalidatePath('/track-order');
    return { success: true };
  } catch (err) {
    console.error('Error updating order status:', err);
    return { success: false, error: 'Status update failed.' };
  }
}

// --- COLLECTIONS & FASHION ITEMS ---
export async function createCollectionAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const coverImage = formData.get('coverImage') as string;
  const isFeatured = formData.get('isFeatured') === 'true';

  if (!title || !category || !description || !coverImage) {
    return { success: false, error: 'Please provide title, category, description, and cover image.' };
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await prisma.collection.create({
      data: {
        title: title.trim(),
        slug,
        category: category.trim(),
        description: description.trim(),
        coverImage: coverImage.trim(),
        isFeatured,
      },
    });

    revalidatePath('/collections');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    console.error('Error creating collection:', err);
    return { success: false, error: 'Collection creation failed.' };
  }
}

export async function updateCollectionAction(formData: FormData) {
  const collectionId = formData.get('id') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const coverImage = formData.get('coverImage') as string;
  const isFeatured = formData.get('isFeatured') === 'true';

  if (!collectionId || !title || !category || !description || !coverImage) {
    return { success: false, error: 'Please provide all required fields.' };
  }

  try {
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        coverImage: coverImage.trim(),
        isFeatured,
      },
    });

    revalidatePath('/collections');
    revalidatePath('/gallery');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    console.error('Error updating collection:', err);
    return { success: false, error: 'Collection update failed.' };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    await prisma.collection.delete({ where: { id: collectionId } });
    revalidatePath('/collections');
    revalidatePath('/gallery');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Delete failed.' };
  }
}

// --- FASHION / GALLERY ITEMS CRUD ---
export async function createFashionItemAction(formData: FormData) {
  const collectionId = formData.get('collectionId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const tags = (formData.get('tags') as string) || '';
  const imageUrl = formData.get('imageUrl') as string;
  const isFeatured = formData.get('isFeatured') === 'true';

  if (!collectionId || !title || !description || !imageUrl) {
    return { success: false, error: 'Please provide title, description, image URL, and select a collection.' };
  }

  try {
    await prisma.fashionItem.create({
      data: {
        collectionId,
        title: title.trim(),
        description: description.trim(),
        category: category ? category.trim() : 'Custom Designs',
        tags: tags.trim(),
        isFeatured,
        media: {
          create: {
            url: imageUrl.trim(),
            mediaType: 'IMAGE',
            altText: title.trim(),
          },
        },
      },
    });

    revalidatePath('/collections');
    revalidatePath('/gallery');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    console.error('Error creating fashion item:', err);
    return { success: false, error: 'Failed to create gallery item.' };
  }
}

export async function updateFashionItemAction(formData: FormData) {
  const itemId = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const tags = (formData.get('tags') as string) || '';
  const imageUrl = formData.get('imageUrl') as string;

  if (!itemId || !title || !description) {
    return { success: false, error: 'Please fill in required fields.' };
  }

  try {
    await prisma.fashionItem.update({
      where: { id: itemId },
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category ? category.trim() : 'Custom Designs',
        tags: tags.trim(),
      },
    });

    if (imageUrl) {
      const existingMedia = await prisma.media.findFirst({ where: { fashionItemId: itemId } });
      if (existingMedia) {
        await prisma.media.update({
          where: { id: existingMedia.id },
          data: { url: imageUrl.trim() },
        });
      } else {
        await prisma.media.create({
          data: {
            fashionItemId: itemId,
            url: imageUrl.trim(),
            mediaType: 'IMAGE',
            altText: title.trim(),
          },
        });
      }
    }

    revalidatePath('/collections');
    revalidatePath('/gallery');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    console.error('Error updating fashion item:', err);
    return { success: false, error: 'Failed to update item.' };
  }
}

export async function deleteFashionItemAction(itemId: string) {
  try {
    await prisma.fashionItem.delete({ where: { id: itemId } });
    revalidatePath('/collections');
    revalidatePath('/gallery');
    revalidatePath('/admin/collections');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete gallery item.' };
  }
}

// --- SETTINGS ---
export async function updateBusinessSettingsAction(formData: FormData) {
  const businessName = formData.get('businessName') as string;
  const tagline = formData.get('tagline') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const address = formData.get('address') as string;
  const openingHours = formData.get('openingHours') as string;
  const instagramUrl = formData.get('instagramUrl') as string;
  const tiktokUrl = formData.get('tiktokUrl') as string;
  const facebookUrl = formData.get('facebookUrl') as string;
  const bioText = formData.get('bioText') as string;
  const missionText = formData.get('missionText') as string;
  const visionText = formData.get('visionText') as string;

  try {
    await prisma.businessSettings.upsert({
      where: { id: 'default' },
      update: {
        businessName: businessName?.trim(),
        tagline: tagline?.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        whatsappNumber: whatsappNumber?.trim(),
        address: address?.trim(),
        openingHours: openingHours?.trim(),
        instagramUrl: instagramUrl?.trim(),
        tiktokUrl: tiktokUrl?.trim(),
        facebookUrl: facebookUrl?.trim(),
        bioText: bioText?.trim(),
        missionText: missionText?.trim(),
        visionText: visionText?.trim(),
      },
      create: {
        id: 'default',
        businessName: businessName?.trim() || 'Fashion Hub',
        tagline: tagline?.trim() || 'Where Your Style Becomes Reality.',
        phone: phone?.trim() || '+234 800 123 4567',
        email: email?.trim() || 'contact@fashionhub.com',
        whatsappNumber: whatsappNumber?.trim() || '2348001234567',
        address: address?.trim() || '12 Fashion Avenue, Victoria Island, Lagos',
        openingHours: openingHours?.trim() || 'Mon - Sat: 9:00 AM - 6:00 PM',
        instagramUrl: instagramUrl?.trim() || 'https://instagram.com',
        tiktokUrl: tiktokUrl?.trim() || 'https://tiktok.com',
        facebookUrl: facebookUrl?.trim() || 'https://facebook.com',
        bioText: bioText?.trim() || 'Bespoke tailoring and modern luxury fashion.',
        missionText: missionText?.trim() || 'To empower individuals through elegant apparel.',
        visionText: visionText?.trim() || 'To be the premier fashion house.',
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: 'Business settings updated successfully!' };
  } catch (err) {
    console.error('Error updating settings:', err);
    return { success: false, error: 'Failed to update settings.' };
  }
}

// --- NOTIFICATIONS ---
export async function markNotificationsAsRead() {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// --- FAQ CRUD ---
export async function createFaqAction(formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const category = (formData.get('category') as string) || 'General';
  const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 0;

  if (!question || !answer) {
    return { success: false, error: 'Question and answer are required.' };
  }

  try {
    await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        displayOrder,
        isPublished: true,
      },
    });
    revalidatePath('/faq');
    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err) {
    console.error('Error creating FAQ:', err);
    return { success: false, error: 'Failed to create FAQ.' };
  }
}

export async function updateFaqAction(formData: FormData) {
  const id = formData.get('id') as string;
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const category = (formData.get('category') as string) || 'General';
  const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 0;
  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !question || !answer) {
    return { success: false, error: 'All fields required.' };
  }

  try {
    await prisma.fAQ.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        displayOrder,
        isPublished,
      },
    });
    revalidatePath('/faq');
    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err) {
    console.error('Error updating FAQ:', err);
    return { success: false, error: 'Failed to update FAQ.' };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath('/faq');
    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete FAQ.' };
  }
}

// --- QUOTES STATUS ---
export async function updateQuoteStatusAction(quoteId: string, status: string) {
  try {
    await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: { status },
    });
    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (err) {
    console.error('Error updating quote status:', err);
    return { success: false, error: 'Failed to update quote status.' };
  }
}

// --- APPOINTMENTS STATUS ---
export async function updateAppointmentStatusAction(appointmentId: string, status: string) {
  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err) {
    console.error('Error updating appointment status:', err);
    return { success: false, error: 'Failed to update appointment status.' };
  }
}

// --- APPRENTICESHIPS STATUS ---
export async function updateApprenticeshipStatusAction(appId: string, status: string, notes?: string) {
  try {
    await prisma.apprenticeshipApplication.update({
      where: { id: appId },
      data: {
        status,
        ...(notes !== undefined ? { internalNotes: notes } : {}),
      },
    });
    revalidatePath('/admin/apprenticeships');
    return { success: true };
  } catch (err) {
    console.error('Error updating apprenticeship status:', err);
    return { success: false, error: 'Failed to update status.' };
  }
}

// --- MESSAGES MARK AS READ ---
export async function markMessageAsRead(messageId: string) {
  try {
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to mark as read.' };
  }
}

export async function markAllMessagesAsRead() {
  try {
    await prisma.contactMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to mark messages as read.' };
  }
}
