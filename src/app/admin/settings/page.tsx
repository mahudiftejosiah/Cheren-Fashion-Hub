import React from 'react';
import { getBusinessSettings } from '@/lib/getSettings';
import { AdminSettingsClient } from './AdminSettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Dynamic Branding Controls
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Business Settings & Contact Configuration
        </h1>
      </div>

      <AdminSettingsClient settings={settings} />
    </div>
  );
}
