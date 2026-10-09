import React from 'react';
import { getBusinessSettings } from '@/lib/getSettings';
import { ContactClient } from './ContactClient';

export const metadata = {
  title: 'Contact Our Fashion Studio',
  description: 'Get in touch with Cheren Fashion Collection via phone, WhatsApp, email, or visit our studio location.',
};

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Get In Touch
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Contact Studio & Atelier
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          Have a question about bespoke fitting, bulk orders, or custom designs? Send us a message or visit our studio.
        </p>
      </div>

      <ContactClient settings={settings} />
    </div>
  );
}
