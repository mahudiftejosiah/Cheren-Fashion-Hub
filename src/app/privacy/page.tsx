import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Cheren Fashion Collection platform.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center">
        <ShieldCheck className="w-10 h-10 text-gold-500 mx-auto mb-3" />
        <h1 className="font-fashion-serif text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 text-xs">Last updated: October 2026</p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When you request a quotation, book a consultation, track an order, or apply for an apprenticeship, we collect personal identification information including your name, email address, phone number, physical delivery address, and body measurement specifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">2. How We Use Your Data</h2>
          <p>
            Your information is strictly utilized to process bespoke tailoring orders, send order progress tracking notifications, schedule fitting appointments, and verify delivery receipt confirmation. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">3. Data Security & Storage</h2>
          <p>
            All persistent data is stored in secure database infrastructure protected by encrypted connections and authenticated admin access controls.
          </p>
        </section>
      </div>
    </div>
  );
}
