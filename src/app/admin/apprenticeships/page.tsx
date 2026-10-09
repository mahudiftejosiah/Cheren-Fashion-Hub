import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminApprenticeshipsClient } from './AdminApprenticeshipsClient';

export const revalidate = 0;

export default async function AdminApprenticeshipsPage() {
  const applications = await prisma.apprenticeshipApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });

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
