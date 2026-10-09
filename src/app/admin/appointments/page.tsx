import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminAppointmentsClient } from './AdminAppointmentsClient';

export const revalidate = 0;

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Calendar & Consultations
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Booked Consultation Appointments
        </h1>
      </div>

      <AdminAppointmentsClient initialAppointments={appointments} />
    </div>
  );
}
