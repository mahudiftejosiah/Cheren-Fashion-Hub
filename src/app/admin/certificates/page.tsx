import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminCertificatesClient } from './AdminCertificatesClient';

export const revalidate = 0;

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });

  const certs = certificates.map((c) => ({
    id: c.id,
    title: c.title,
    institution: c.institution,
    dateObtained: c.dateObtained,
    description: c.description,
    fileUrl: c.fileUrl,
    fileType: c.fileType,
    isPublished: c.isPublished,
    displayOrder: c.displayOrder,
    createdAt: c.createdAt,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Brand Credentials
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Certificates &amp; Qualifications
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Upload and manage certificates shown on the public About page.
        </p>
      </div>
      <AdminCertificatesClient initialCerts={certs} />
    </div>
  );
}
