'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitApprenticeshipApplication(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const location = formData.get('location') as string;
  const experienceLevel = formData.get('experienceLevel') as string;
  const skillLevel = formData.get('skillLevel') as string;
  const motivation = formData.get('motivation') as string;
  const availability = formData.get('availability') as string;

  if (!fullName || !phone || !email || !location || !experienceLevel || !motivation) {
    return { success: false, error: 'Please fill out all required application fields.' };
  }

  try {
    const app = await prisma.apprenticeshipApplication.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        experienceLevel: experienceLevel.trim(),
        skillLevel: skillLevel ? skillLevel.trim() : 'Beginner',
        motivation: motivation.trim(),
        availability: availability ? availability.trim() : 'Full-time',
        status: 'PENDING',
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: 'New Apprenticeship Application',
        message: `${fullName} from ${location} applied for the Fashion Apprenticeship Program.`,
        type: 'APPRENTICESHIP',
        linkUrl: `/admin/apprenticeships`,
      },
    });

    revalidatePath('/admin/apprenticeships');
    return {
      success: true,
      message: 'Your apprenticeship application has been submitted successfully! Our admissions panel will review your submission.',
      applicationId: app.id,
    };
  } catch (err) {
    console.error('Error submitting application:', err);
    return { success: false, error: 'Application submission failed. Please try again.' };
  }
}
