'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitAppointmentRequest(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const preferredDate = formData.get('preferredDate') as string;
  const preferredTime = formData.get('preferredTime') as string;
  const serviceType = formData.get('serviceType') as string;
  const additionalInfo = (formData.get('additionalInfo') as string) || null;

  if (!name || !phone || !email || !preferredDate || !preferredTime || !serviceType) {
    return { success: false, error: 'Please complete all required fields.' };
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDate: preferredDate.trim(),
        preferredTime: preferredTime.trim(),
        serviceType: serviceType.trim(),
        additionalInfo: additionalInfo ? additionalInfo.trim() : null,
        status: 'PENDING',
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: 'New Consultation Appointment Booked',
        message: `${name} booked a consultation for ${preferredDate} at ${preferredTime} (${serviceType}).`,
        type: 'APPOINTMENT',
        linkUrl: `/admin/appointments`,
      },
    });

    revalidatePath('/admin/appointments');
    return {
      success: true,
      message: 'Your consultation appointment request has been received! We will send a confirmation message to your email and phone.',
      appointmentId: appointment.id,
    };
  } catch (err) {
    console.error('Error booking appointment:', err);
    return { success: false, error: 'Failed to book appointment. Please try again.' };
  }
}
