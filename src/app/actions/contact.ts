'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = (formData.get('phone') as string) || null;
  const subject = (formData.get('subject') as string) || 'General Enquiry';
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, error: 'Please provide your name, email, and message.' };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: 'New Contact Message Received',
        message: `Message from ${name} (${subject}): "${message.slice(0, 40)}..."`,
        type: 'CONTACT',
        linkUrl: `/admin/messages`,
      },
    });

    revalidatePath('/admin/messages');
    return {
      success: true,
      message: 'Thank you for reaching out! We have received your message and will respond promptly.',
    };
  } catch (err) {
    console.error('Error submitting contact form:', err);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}
