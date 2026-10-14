import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminApprenticeshipsClient } from './AdminApprenticeshipsClient';

export const revalidate = 0;

export default async function AdminApprenticeshipsPage() {
  const raw = await prisma.apprenticeshipApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map to exact shape including new email tracking fields
  const applications = raw.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    email: a.email,
    location: a.location,
    experienceLevel: a.experienceLevel,
    skillLevel: a.skillLevel,
    motivation: a.motivation,
    availability: a.availability,
    status: a.status,
    internalNotes: a.internalNotes,
    emailStatus: a.emailStatus,
    emailSentAt: a.emailSentAt,
    emailError: a.emailError,
    createdAt: a.createdAt,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Admissions & Training
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Apprenticeship Applications
        </h1>
      </div>

      <AdminApprenticeshipsClient initialApps={applications} />
    </div>
  );
}
