import React from 'react';
import { TrackOrderClient } from './TrackOrderClient';

export const metadata = {
  title: 'Track My Order',
  description: 'Track your custom tailored fashion order in real-time using your unique tracking number.',
};

export default function TrackOrderPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Live Order Status
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Track My Order
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Enter your unique tracking reference code (e.g., <code className="bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded font-mono font-bold">FH-2026-0001</code>) to view your outfit's tailoring progress.
        </p>
      </div>

      <TrackOrderClient />
    </div>
  );
}
