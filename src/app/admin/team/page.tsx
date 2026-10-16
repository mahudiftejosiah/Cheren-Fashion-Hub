import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminTeamClient } from './AdminTeamClient';

export const metadata = { title: 'Manage Team Members' };

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-fashion-serif">Team Members</h1>
        <p className="text-zinc-400 text-xs mt-1">
          Manage co-founders and team members that appear on the public About page.
        </p>
      </div>
      <AdminTeamClient initialMembers={members} />
    </div>
  );
}
