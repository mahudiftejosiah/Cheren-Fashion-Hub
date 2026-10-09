import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions for Cheren Fashion Collection tailoring services.',
};

export default function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center">
        <ShieldCheck className="w-10 h-10 text-gold-500 mx-auto mb-3" />
        <h1 className="font-fashion-serif text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Terms & Conditions
        </h1>
        <p className="text-zinc-500 text-xs">Last updated: October 2026</p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">1. Bespoke Orders & Measurements</h2>
          <p>
            All custom tailoring orders are hand-crafted to the measurements provided during your consultation. Clients are responsible for ensuring measurement accuracy when submitting specifications online.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">2. Delivery & Receipt Confirmation</h2>
          <p>
            Each completed outfit is issued a unique tracking number. Upon receipt of your package, clients agree to mark delivery confirmation on the tracking portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">3. Customer Feedback & Testimonials</h2>
          <p>
            Submitted reviews and optional photos are moderated by site administrators before public display on testimonials feeds.
          </p>
        </section>
      </div>
    </div>
  );
}
